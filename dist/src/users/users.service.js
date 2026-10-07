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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async signup(userSignUpDto) {
        const existingUser = await this.findUserByEmail(userSignUpDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Bu email adresi zaten kullanılıyor.');
        }
        userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, 10);
        const user = this.userRepository.create(userSignUpDto);
        return await this.userRepository.save(user);
    }
    async signin(userSignInDto) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: userSignInDto.email })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı.');
        }
        const isPasswordValid = await bcrypt.compare(userSignInDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı.');
        }
        return user;
    }
    async accesToken(user) {
        return (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME });
    }
    async findAll() {
        return await this.userRepository.find();
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı.`);
        }
        return user;
    }
    async update(id, userUpdateDto) {
        const user = await this.findById(id);
        return await this.userRepository.save({ ...user, ...userUpdateDto });
    }
    async delete(id) {
        const user = await this.findById(id);
        return await this.userRepository.remove(user);
    }
    async findUserByEmail(email) {
        return await this.userRepository.findOneBy({ email });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map