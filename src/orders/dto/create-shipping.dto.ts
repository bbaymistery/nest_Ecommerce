import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto {

    @IsNotEmpty({ message: "phone number is required" })
    @IsString({ message: "phone number must be a string" })
    phone: string;

    @IsNotEmpty({ message: "name is required" })
    @IsString({ message: "name must be a string" })
    name: string;

    @IsNotEmpty({ message: "address is required" })
    @IsString({ message: "address must be a string" })
    address: string;

    @IsNotEmpty({ message: "city is required" })
    @IsString({ message: "city must be a string" })
    city: string;

    @IsNotEmpty({ message: "postCode is required" })
    @IsString({ message: "postCode must be a string" })
    postcode: string;

    @IsNotEmpty({ message: "state is required" })
    @IsString({ message: "state must be a string" })
    state: string;

    @IsNotEmpty({ message: "country is required" })
    @IsString({ message: "country must be a string" })
    country: string;

    @IsOptional() shippingCompany?: string;
}