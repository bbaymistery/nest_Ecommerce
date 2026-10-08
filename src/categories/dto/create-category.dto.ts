import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {

    @IsNotEmpty({ message: 'Kategori adı boş bırakılamaz.' })
    @IsString({ message: 'Kategori adı metin formatında olmalıdır.' })
    title: string;

    @IsNotEmpty({ message: 'Kategori açıklama bilgisi zorunludur.' })
    @IsString({ message: 'Kategori açıklaması metin formatında olmalıdır.' })
    description: string;
}
