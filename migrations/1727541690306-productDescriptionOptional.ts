import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductDescriptionOptional1727541690306 implements MigrationInterface {
    name = 'ProductDescriptionOptional1727541690306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "description" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
    }

}
