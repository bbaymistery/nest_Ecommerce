"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const user_signin_dto_1 = require("./user-signin.dto");
class UpdateUserDto extends (0, mapped_types_1.PartialType)(user_signin_dto_1.UserSignInDto) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map