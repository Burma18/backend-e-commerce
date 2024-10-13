import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentOrder1728814983785 implements MigrationInterface {
    name = 'UpdatePaymentOrder1728814983785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."orders_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "invoiceId" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "paymentUrl" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "paymentConfirmedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "currencyType" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "paidAsset" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "feeAmount" numeric(10, 2)
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "paidAmount" numeric(10, 2)
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payment_status_enum"
            RENAME TO "payment_status_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum" AS ENUM('paid', 'init', 'failed')
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ALTER COLUMN "status" TYPE "public"."payment_status_enum" USING "status"::"text"::"public"."payment_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum_old"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payment_status_enum"
            RENAME TO "payment_status_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum" AS ENUM('paid', 'init', 'failed')
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ALTER COLUMN "status" TYPE "public"."payment_status_enum" USING "status"::"text"::"public"."payment_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum_old" AS ENUM('SUCCESS', 'FAILED')
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ALTER COLUMN "status" TYPE "public"."payment_status_enum_old" USING "status"::"text"::"public"."payment_status_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payment_status_enum_old"
            RENAME TO "payment_status_enum"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum_old" AS ENUM('SUCCESS', 'FAILED')
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ALTER COLUMN "status" TYPE "public"."payment_status_enum_old" USING "status"::"text"::"public"."payment_status_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payment_status_enum_old"
            RENAME TO "payment_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "paidAmount"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "feeAmount"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "paidAsset"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "currencyType"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "paymentConfirmedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "paymentUrl"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "invoiceId"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELED')
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING'
        `);
    }

}
