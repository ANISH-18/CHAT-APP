import { MigrationInterface, QueryRunner } from "typeorm";

export class Isonline1712052218076 implements MigrationInterface {
    name = 'Isonline1712052218076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isonline"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isonline" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isonline"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isonline" character varying`);
    }

}
