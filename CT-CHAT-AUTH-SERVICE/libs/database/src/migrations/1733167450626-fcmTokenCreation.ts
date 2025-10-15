import { MigrationInterface, QueryRunner } from "typeorm";

export class FcmTokenCreation1733167450626 implements MigrationInterface {
    name = 'FcmTokenCreation1733167450626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."fcm_tokens_devicetype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "fcm_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fcmToken" text, "deviceType" "public"."fcm_tokens_devicetype_enum", "lastUsed" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userCredId" uuid, CONSTRAINT "PK_0802a779d616597e9330bb9a7cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fcm_tokens" ADD CONSTRAINT "FK_0827672528654c4a5943478022f" FOREIGN KEY ("userCredId") REFERENCES "user"("cred_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fcm_tokens" DROP CONSTRAINT "FK_0827672528654c4a5943478022f"`);
        await queryRunner.query(`DROP TABLE "fcm_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."fcm_tokens_devicetype_enum"`);
    }

}
