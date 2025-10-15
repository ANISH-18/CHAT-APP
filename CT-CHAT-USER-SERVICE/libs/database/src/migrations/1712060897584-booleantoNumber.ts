import { MigrationInterface, QueryRunner } from "typeorm";

export class BooleantoNumber1712060897584 implements MigrationInterface {
    name = 'BooleantoNumber1712060897584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isonline"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isonline" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isonline"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isonline" boolean`);
    }

}
