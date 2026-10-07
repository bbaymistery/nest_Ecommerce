import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//"PartialType> Ben CreateUserDto içindeki tüm kuralları ve mesajları koruyorum,
//  ama artık profil güncellemesi yapıldığı için hepsini isteğe bağlı kılıyorum."
export class UpdateUserDto extends PartialType(CreateUserDto) { }
