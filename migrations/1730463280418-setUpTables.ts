import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUpTables1730463280418 implements MigrationInterface {
  name = 'SetUpTables1730463280418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "credentials" jsonb,
                "price" numeric NOT NULL,
                "categoryId" integer NOT NULL,
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "order_item" (
                "id" SERIAL NOT NULL,
                "orderId" integer NOT NULL,
                "quantity" integer NOT NULL,
                "productId" integer,
                CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELED')
        `);
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL NOT NULL,
                "totalPrice" numeric NOT NULL,
                "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING',
                "userId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."newsletter_status_enum" AS ENUM('SENT', 'CANCELED', 'CREATED', 'EDITED')
        `);
    await queryRunner.query(`
            CREATE TABLE "newsletter" (
                "id" SERIAL NOT NULL,
                "message" text NOT NULL,
                "status" "public"."newsletter_status_enum" NOT NULL DEFAULT 'CREATED',
                "sentAt" TIMESTAMP,
                "userId" integer,
                CONSTRAINT "PK_036bb790d1d19efeacfd2f3740c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "support" (
                "id" SERIAL NOT NULL,
                "message" text NOT NULL,
                "response" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer,
                CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum" AS ENUM('paid', 'init', 'failed')
        `);
    await queryRunner.query(`
            CREATE TABLE "payment" (
                "id" SERIAL NOT NULL,
                "amount" numeric(10, 2) NOT NULL,
                "status" "public"."payment_status_enum" NOT NULL,
                "paymentDate" TIMESTAMP NOT NULL DEFAULT now(),
                "invoiceId" character varying,
                "paymentUrl" character varying,
                "paymentConfirmedAt" TIMESTAMP,
                "currencyType" character varying,
                "paidAsset" character varying,
                "feeAmount" numeric(10, 2),
                "paidAmount" numeric(10, 2),
                "userId" integer,
                CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "telegramId" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER',
                "balance" character varying NOT NULL DEFAULT '0',
                "isBlocked" boolean NOT NULL DEFAULT false,
                "receiveNewsletter" boolean NOT NULL DEFAULT true,
                "registrationDate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_item"
            ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_item"
            ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "newsletter"
            ADD CONSTRAINT "FK_20f63020913bbfdc1835e080549" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "support"
            ADD CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "payment"
            ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"
        `);
    await queryRunner.query(`
            ALTER TABLE "support" DROP CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036"
        `);
    await queryRunner.query(`
            ALTER TABLE "newsletter" DROP CONSTRAINT "FK_20f63020913bbfdc1835e080549"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "payment"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "support"
        `);
    await queryRunner.query(`
            DROP TABLE "newsletter"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."newsletter_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."orders_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "order_item"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
  }
}
