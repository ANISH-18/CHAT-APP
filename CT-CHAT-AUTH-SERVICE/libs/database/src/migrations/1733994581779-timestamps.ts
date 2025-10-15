import { MigrationInterface, QueryRunner } from "typeorm";

export class Timestamps1733994581779 implements MigrationInterface {
    name = 'Timestamps1733994581779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fcm_tokens" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "fcm_tokens" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fcm_tokens" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "fcm_tokens" DROP COLUMN "updated_at"`);
    }

}
