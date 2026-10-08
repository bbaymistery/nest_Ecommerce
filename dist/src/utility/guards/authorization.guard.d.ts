import { CanActivate, Type } from "@nestjs/common";
export declare const AuthorizeGuard: (roles: string | string[]) => Type<CanActivate>;
