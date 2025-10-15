import { MigrationInterface, QueryRunner } from "typeorm";

export class DisableSchool1734683467217 implements MigrationInterface {
    name = 'DisableSchool1734683467217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "parentActive" integer DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "parentActive"`);
    }

}
