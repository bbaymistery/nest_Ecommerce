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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("typeorm");
const categories_service_1 = require("../categories/categories.service");
let ProductsService = class ProductsService {
    constructor(productRepository, categoriesService) {
        this.productRepository = productRepository;
        this.categoriesService = categoriesService;
    }
    async create(createProductDto, currentUser) {
        const category = await this.categoriesService.findOne(createProductDto.categoryId);
        console.log({ category });
        const product = this.productRepository.create(createProductDto);
        console.log({ product });
        product.addedBy = currentUser;
        product.category = category;
        return await this.productRepository.save(product);
    }
    async findAll() {
        return await this.productRepository.find({
            relations: {
                category: true,
                addedBy: true,
            }
        });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: {
                category: true,
                addedBy: true,
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Ürün (#${id}) bulunamadı.`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        if (updateProductDto.categoryId) {
            const category = await this.categoriesService.findOne(updateProductDto.categoryId);
            product.category = category;
        }
        return await this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        return await this.productRepository.remove(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map