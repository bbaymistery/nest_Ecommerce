"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCreatedAtAndUpdatedAtToUsers1791382237839 = void 0;
class AddCreatedAtAndUpdatedAtToUsers1791382237839 {
    constructor() {
        this.name = 'AddCreatedAtAndUpdatedAtToUsers1791382237839';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    }
}
exports.AddCreatedAtAndUpdatedAtToUsers1791382237839 = AddCreatedAtAndUpdatedAtToUsers1791382237839;
//# sourceMappingURL=1791382237839-add_created_at_and_updated_at_to_users.js.map