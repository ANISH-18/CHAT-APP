import { MigrationInterface, QueryRunner } from "typeorm";

export class JsonB1714372432729 implements MigrationInterface {
    name = 'JsonB1714372432729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userData" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userData"`);
    }

}
