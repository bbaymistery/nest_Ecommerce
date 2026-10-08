import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

    @IsNotEmpty({ message: "Lütfen yorumu giriniz" })
    @IsString()
    comment: string;

    @IsNotEmpty({ message: "Lütfen puanı giriniz" })
    @IsNumber()
    ratings: number;

    @IsNotEmpty({ message: "Lütfen ürün ID'sini giriniz" })
    @IsNumber({}, { message: "Ürün ID pozitif bir sayı olmalıdır" })
    productId: number;
}
