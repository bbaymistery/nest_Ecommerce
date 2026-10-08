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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = void 0;
const class_validator_1 = require("class-validator");
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Ürün adı zorunludur.' }),
    (0, class_validator_1.IsString)({ message: 'Ürün adı metin formatında olmalıdır.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Ürün açıklaması zorunludur.' }),
    (0, class_validator_1.IsString)({ message: 'Ürün açıklaması metin formatında olmalıdır.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2, }, { message: 'Ürün fiyatı sayı formatında olmalıdır.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Ürün fiyatı zorunludur.' }),
    (0, class_validator_1.IsPositive)({ message: 'Ürün fiyatı pozitif bir sayı olmalıdır.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: "Stock Should be a number " }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Ürün stok bilgisi zorunludur.' }),
    (0, class_validator_1.Min)(0, { message: 'Price can not be negative' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Resimler dizi formatında olmalıdır.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Resimler zorunludur.' }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Kategori ID sayı formatında olmalıdır.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kategori ID zorunludur.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "category", void 0);
//# sourceMappingURL=create-product.dto.js.map