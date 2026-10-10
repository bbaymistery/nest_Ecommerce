import { IsOptional, IsString, IsNumber, } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minRating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxRating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;
}
