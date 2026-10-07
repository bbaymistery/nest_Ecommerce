import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddCreatedAtAndUpdatedAtToUsers1791382237839 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
