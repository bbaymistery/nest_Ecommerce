import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserSignInDto {

    @IsEmail({}, { message: "Email formatı doğru değil" })
    @IsNotEmpty({ message: "Email alanı boş bırakılamaz." })
    email: string;

    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password can not be null" })
    @MinLength(5, { message: "Password must be at least 5 characters long" })
    password: string;
}