import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReceiveNewsletter1730456176709 implements MigrationInterface {
    name = 'AddReceiveNewsletter1730456176709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "receiveNewsletter" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "receiveNewsletter"
        `);
    }

}
