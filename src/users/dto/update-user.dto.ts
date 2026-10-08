import { PartialType } from '@nestjs/mapped-types';
import { UserSignInDto } from './user-signin.dto';

//"PartialType> Ben CreateUserDto içindeki tüm kuralları ve mesajları koruyorum,
//  ama artık profil güncellemesi yapıldığı için hepsini isteğe bağlı kılıyorum."
export class UpdateUserDto extends PartialType(UserSignInDto) { }
