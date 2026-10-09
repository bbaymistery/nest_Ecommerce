import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductsDto {

    @IsNotEmpty({ message: "Product id is required" })
    id: number;

    @IsPositive({ message: "Product unit price must be a positive number" })
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: "product_unit_price must be a number" }
    )
    product_unit_price: number;

    @IsPositive({ message: "product_quantity must be a positive number" })
    @IsNumber({}, { message: "product_quantity must be a number" })
    product_quantity: number
}