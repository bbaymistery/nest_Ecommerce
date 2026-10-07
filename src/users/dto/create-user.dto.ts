import { IsString } from "class-validator";
/*
DTO (Data Transfer Object):
 Postman veya Frontend'den gelen isteklerin GÜVENLİK VE KONTROL KAPISIDIR.

Amacı: Dış dünyadan gelen verinin formatını denetlemektir(@IsString(), @IsEmail(), vb.).

Neden Var? Kullanıcı hatalı, eksik veya zararlı veri gönderirse 
(örneğin email formatında olmayan bir string veya boş değer),
 istek daha servis ve veritabanına ulaşmadan kapıda engellensin diye.
*/
export class CreateUserDto {
    @IsString()
    name: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
}
