import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
/*
DTO (Data Transfer Object):
 Postman veya Frontend'den gelen isteklerin GÜVENLİK VE KONTROL KAPISIDIR.

Amacı: Dış dünyadan gelen verinin formatını denetlemektir(@IsString(), @IsEmail(), vb.).

Neden Var? Kullanıcı hatalı, eksik veya zararlı veri gönderirse 
(örneğin email formatında olmayan bir string veya boş değer),
 istek daha servis ve veritabanına ulaşmadan kapıda engellensin diye.
*/
export class UserSignUpDto {
    @IsString({ message: "Name must be a string" })
    @IsNotEmpty({ message: "Name can not be null" })
    name: string;

    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email can not be null" })
    @IsEmail({}, { message: "Please provide a valid email address" })
    email: string;

    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password can not be null" })
    @MinLength(5, { message: "Password must be at least 5 characters long" })
    password: string;
}
