import { MigrationInterface, QueryRunner } from "typeorm";

export class JsonB1714392240189 implements MigrationInterface {
    name = 'JsonB1714392240189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userData" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userData"`);
    }

}
