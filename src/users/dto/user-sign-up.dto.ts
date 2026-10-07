import { IsNotEmpty, IsString } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";
/*
DTO (Data Transfer Object):
 Postman veya Frontend'den gelen isteklerin GÜVENLİK VE KONTROL KAPISIDIR.

Amacı: Dış dünyadan gelen verinin formatını denetlemektir(@IsString(), @IsEmail(), vb.).

Neden Var? Kullanıcı hatalı, eksik veya zararlı veri gönderirse 
(örneğin email formatında olmayan bir string veya boş değer),
 istek daha servis ve veritabanına ulaşmadan kapıda engellensin diye.
*/
export class UserSignUpDto extends UserSignInDto {
    @IsString({ message: "Name must be a string" })
    @IsNotEmpty({ message: "Name can not be null" })
    name: string;
}
