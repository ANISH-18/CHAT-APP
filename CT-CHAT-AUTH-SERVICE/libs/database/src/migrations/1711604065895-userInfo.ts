import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInfo1711604065895 implements MigrationInterface {
    name = 'UserInfo1711604065895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_pic" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_pic"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    }

}
