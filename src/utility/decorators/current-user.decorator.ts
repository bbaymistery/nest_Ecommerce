import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom Param Decorator: @CurrentUser()
 * 
 * Görevi: Controller metodlarında (Örn: getProfile(@CurrentUser() user)) 
 * Middleware tarafından req.currentUser'a yüklenen kullanıcı nesnesini doğrudan
 *  çekip metoda parametre olarak vermektir.
 */
export const CurrentUser = createParamDecorator((data: never, ctx: ExecutionContext) => {
    // ExecutionContext kullanarak HTTP Request nesnesini alıyoruz
    const req = ctx.switchToHttp().getRequest();
    // Middleware'in req üzerine koyduğu kullanıcıyı dönüyoruz
    return req.currentUser;
});