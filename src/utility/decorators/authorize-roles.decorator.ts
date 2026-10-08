import { SetMetadata } from "@nestjs/common";

/**
 * @AuthorizeRoles('admin', 'user') DEKORATÖRÜ
 * 
 * Görevi: Controller metodunun üzerine konularak o metot için hangi rollerin 
 * yetkili olduğunu NestJS Metadata (bilgi deposu) içerisine kaydeder.
 * 
 * Örnek Kullanım:
 * @AuthorizeRoles(Roles.ADMIN)
 * @UseGuards(AuthenticationGuard, AuthorizeGuard)
 * @Delete(':id')
 * async deleteUser() { ... }
 */
export const AuthorizeRoles =
    (...roles: string[]) => SetMetadata('allowedRoles', roles);

