import { MigrationInterface, QueryRunner } from "typeorm";

export class FcmToken1713958424768 implements MigrationInterface {
    name = 'FcmToken1713958424768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fcm_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fcm_token"`);
    }

}
