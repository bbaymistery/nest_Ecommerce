"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_sign_up_dto_1 = require("./dto/user-sign-up.dto");
const user_entity_1 = require("./entities/user.entity");
const user_signin_dto_1 = require("./dto/user-signin.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const current_user_decorator_1 = require("../utility/decorators/current-user.decorator");
const authentication_guard_1 = require("../utility/guards/authentication.guard");
const authorize_roles_decorator_1 = require("../utility/decorators/authorize-roles.decorator");
const user_roles_enum_1 = require("../utility/common/user-roles.enum");
const authorization_guard_1 = require("../utility/guards/authorization.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async signup(userSignUpDto) {
        return await this.usersService.signup(userSignUpDto);
    }
    async signin(userSignInDto) {
        const user = await this.usersService.signin(userSignInDto);
        const accesToken = await this.usersService.accesToken(user);
        return { accesToken, user };
    }
    async findAll() {
        return await this.usersService.findAll();
    }
    async getProfile(currentUser) {
        if (!currentUser) {
            throw new common_1.UnauthorizedException('Geçerli bir Token bulunamadı. Lütfen önce giriş yapın.');
        }
        return currentUser;
    }
    async findById(id) {
        return await this.usersService.findById(+id);
    }
    async update(id, userUpdateDto) {
        return await this.usersService.update(+id, userUpdateDto);
    }
    async delete(id) {
        const user = await this.usersService.delete(+id);
        return { message: "User deleted successfully", user };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_sign_up_dto_1.UserSignUpDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("signin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_signin_dto_1.UserSignInDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signin", null);
__decorate([
    (0, authorize_roles_decorator_1.AuthorizeRoles)(user_roles_enum_1.Roles.ADMIN),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, authorization_guard_1.AuthorizeGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, common_1.Get)("me"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map