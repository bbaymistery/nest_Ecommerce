import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

/**
 * 1. AUTHENTICATION GUARD (KİMLİK DOĞRULAMA GÜVENLİK GÖREVLİSİ)
 * 
 * Soru: "Sen KİMSİN?" / "Giriş yapılmış mı?"
 * 
 * Görevi: İsteği atan kişinin sisteme giriş yapıp yapmadığını (yani req.currentUser nesnesinin var olup olmadığını) kontrol eder.
 * 
 * Analoji 🎪: Gece kulübünün veya etkinliğin KAPISINDAKİ KİMLİK / BİLET KONTROLÜ.
 * Kapıdaki görevli sadece "Biletin/Kimliğin var mı?" diye bakar. Varsa içeriye alır.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        // HTTP Request nesnesini alıyoruz
        const request = context.switchToHttp().getRequest();

        // Eğer kullanıcı giriş yapmışsa (Middleware req.currentUser doldurduysa) geçişe izin ver
        if (request.currentUser) {
            return true;
        }

        // Kullanıcı giriş yapmamışsa (veya Token geçersizse) 401 hatası fırlat
        throw new UnauthorizedException('Lütfen önce giriş yapın (Token geçersiz veya süresi dolmuş).');
    }
}