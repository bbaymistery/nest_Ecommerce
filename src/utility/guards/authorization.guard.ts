

import { CanActivate, ExecutionContext, Injectable, mixin, Type, UnauthorizedException } from "@nestjs/common";

/**
 * AUTHORIZE GUARD (DİNAMİK ROL GÜVENLİK GÖREVLİSİ)
 * 
 * Artık ayrı bir @AuthorizeRoles() dekoratörüne gerek kalmadan 
 * doğrudan Guard içerisinde parametre olarak rol gönderebilirsin!
 * 
 * Örnek Kullanım:
 * @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
 * veya birden fazla rol için:
 * @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN, Roles.USER]))
 */
export const AuthorizeGuard = (roles: string | string[]): Type<CanActivate> => {
    // Parametre olarak tek string gelirse diziye çeviriyoruz (Örn: 'admin' -> ['admin'])
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    @Injectable()
    class AuthorizeGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            // 1. HTTP Request nesnesini alıyoruz
            const request = context.switchToHttp().getRequest();

            // 2. Oturum açan kullanıcının rollerini alıyoruz
            const userRoles: string[] = request?.currentUser?.role || request?.currentUser?.roles || [];

            // 3. Kullanıcının rollerinden en az bir tanesi izin verilen roller (allowedRoles) listesinde var mı kontrol ediyoruz
            const hasPermission = userRoles.some((role: string) => allowedRoles.includes(role));

            // Yetkisi varsa geçişe izin ver
            if (hasPermission) return true;

            // Yetkisi yoksa 401 UnauthorizedException hatası fırlat
            throw new UnauthorizedException("Bu işlem için yetkiniz bulunmamaktadır (Erişim Engellendi).");
        }
    }

    return mixin(AuthorizeGuardMixin);
};
