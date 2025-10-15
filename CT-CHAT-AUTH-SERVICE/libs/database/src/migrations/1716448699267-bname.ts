import { MigrationInterface, QueryRunner } from "typeorm";

export class Bname1716448699267 implements MigrationInterface {
    name = 'Bname1716448699267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "businessName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "businessName"`);
    }

}
