import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1726727228126 implements MigrationInterface {
    name = 'AddUser1726727228126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "telegramId" character varying NOT NULL,
                "balance" double precision NOT NULL DEFAULT '0',
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER',
                "isBlocked" boolean NOT NULL DEFAULT false,
                "registrationDate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
    }

}
