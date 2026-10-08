"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeGuard = void 0;
const common_1 = require("@nestjs/common");
const AuthorizeGuard = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    let AuthorizeGuardMixin = class AuthorizeGuardMixin {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const userRoles = request?.currentUser?.role || request?.currentUser?.roles || [];
            const hasPermission = userRoles.some((role) => allowedRoles.includes(role));
            if (hasPermission)
                return true;
            throw new common_1.UnauthorizedException("Bu işlem için yetkiniz bulunmamaktadır (Erişim Engellendi).");
        }
    };
    AuthorizeGuardMixin = __decorate([
        (0, common_1.Injectable)()
    ], AuthorizeGuardMixin);
    return (0, common_1.mixin)(AuthorizeGuardMixin);
};
exports.AuthorizeGuard = AuthorizeGuard;
//# sourceMappingURL=authorization.guard.js.map