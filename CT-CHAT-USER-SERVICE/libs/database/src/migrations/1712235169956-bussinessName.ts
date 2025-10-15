import { MigrationInterface, QueryRunner } from "typeorm";

export class BussinessName1712235169956 implements MigrationInterface {
    name = 'BussinessName1712235169956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "businessName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "businessName"`);
    }

}
