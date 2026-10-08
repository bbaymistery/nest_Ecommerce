"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTBlPoducts1791457161055 = void 0;
class AddTBlPoducts1791457161055 {
    constructor() {
        this.name = 'AddTBlPoducts1791457161055';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "product_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL, "image" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, "categoryId" integer, CONSTRAINT "PK_6e8f75045ddcd1c389c765c896e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "is_active" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD CONSTRAINT "FK_8b0d55381f493e07c428b104920" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD CONSTRAINT "FK_641188cadea80dfe98d4c769ebf" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product_entity" DROP CONSTRAINT "FK_641188cadea80dfe98d4c769ebf"`);
        await queryRunner.query(`ALTER TABLE "product_entity" DROP CONSTRAINT "FK_8b0d55381f493e07c428b104920"`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "is_active" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "product_entity"`);
    }
}
exports.AddTBlPoducts1791457161055 = AddTBlPoducts1791457161055;
//# sourceMappingURL=1791457161055-addTBl_poducts.js.map