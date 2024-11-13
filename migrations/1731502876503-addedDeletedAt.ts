import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDeletedAt1731502876503 implements MigrationInterface {
    name = 'AddedDeletedAt1731502876503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "categories"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "products"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "order_item"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "newsletter"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "support"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deletedAt" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "support" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "newsletter" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_item" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "categories" DROP COLUMN "deletedAt"
        `);
    }

}
