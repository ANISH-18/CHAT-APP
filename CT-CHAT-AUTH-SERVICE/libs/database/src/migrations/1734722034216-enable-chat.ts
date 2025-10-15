import { MigrationInterface, QueryRunner } from "typeorm";

export class EnableChat1734722034216 implements MigrationInterface {
    name = 'EnableChat1734722034216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "chatEnabled" boolean DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "chatEnabled"`);
    }

}
