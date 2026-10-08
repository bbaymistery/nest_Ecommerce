

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * 2. AUTHORIZE GUARD (YETKİLENDİRME / ROL KONTROL GÜVENLİK GÖREVLİSİ)
 * 
 * Soru: "Senin BURAYA GİRMEYE YETKİN VAR MI?" / "Rolün ne?"
 * 
 * Görevi: Sisteme giriş yapmış kullanıcının hedef metoda (Örn: @AuthorizeRoles('admin')) 
 * erişmek için gerekli ROLÜNE sahip olup olmadığını kontrol eder.
 * 
 * Analoji 👑: Kulübe girdikten sonra VIP ODASININ KAPISINDAKİ YETKİ KONTROLÜ.
 * Kapıdaki görevli: "Evet kimliğin var (Authentication tamam), ama bakalım VIP kartın (Admin rolün) var mı?"
 */
@Injectable()
export class AuthorizeGuard implements CanActivate {
    // Reflector: Controller metodunun üzerindeki @AuthorizeRoles(...) dekoratöründen eklediğimiz metadata'yı okur
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Controller metodunun üzerindeki @AuthorizeRoles('admin', 'user') dekoratöründen izin verilen rolleri çekiyoruz
        const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());

        // Eğer metoda herhangi bir rol kısıtlaması konulmamışsa herkese izin ver
        if (!allowedRoles) return true;

        // 2. HTTP Request nesnesini alıyoruz
        const request = context.switchToHttp().getRequest();

        // 3. Kullanıcının rollerini alıyoruz (UserEntity içinde 'role' dizisi olarak saklanır)
        const userRoles: string[] = request?.currentUser?.role || request?.currentUser?.roles || [];

        // 4. Kullanıcının rollerinden en az bir tanesi izin verilen roller (allowedRoles) listesinde var mı bakıyoruz
        const hasPermission = userRoles.some((role: string) => allowedRoles.includes(role));

        // Yetkisi varsa geçişe izin ver
        if (hasPermission) return true;

        // Yetkisi yoksa (Örn: Normal kullanıcı Admin sayfasına girmeye çalışıyorsa) hatayı fırlat
        throw new UnauthorizedException("Bu işlem için yetkiniz bulunmamaktadır (Erişim Engellendi).");
    }
}