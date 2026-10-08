import { IsString, IsNotEmpty, IsNumber, IsPositive, Min, IsArray } from 'class-validator';

export class CreateProductDto {

    @IsNotEmpty({ message: 'Ürün adı zorunludur.' })
    @IsString({ message: 'Ürün adı metin formatında olmalıdır.' })
    title: string;

    @IsNotEmpty({ message: 'Ürün açıklaması zorunludur.' })
    @IsString({ message: 'Ürün açıklaması metin formatında olmalıdır.' })
    description: string;

    @IsNumber(
        { maxDecimalPlaces: 2, },
        { message: 'Ürün fiyatı sayı formatında olmalıdır.' }
    )
    @IsNotEmpty({ message: 'Ürün fiyatı zorunludur.' })
    @IsPositive({ message: 'Ürün fiyatı pozitif bir sayı olmalıdır.' })
    price: number;

    @IsNumber({}, { message: "Stock Should be a number " })
    @IsNotEmpty({ message: 'Ürün stok bilgisi zorunludur.' })
    @Min(0, { message: 'Price can not be negative' })
    stock: number;

    @IsArray({ message: 'Resimler dizi formatında olmalıdır.' })
    @IsNotEmpty({ message: 'Resimler zorunludur.' })
    images: [];

    @IsNumber({}, { message: 'Kategori ID sayı formatında olmalıdır.' })
    @IsNotEmpty({ message: 'Kategori ID zorunludur.' })
    category: number;
}
