import { MigrationInterface, QueryRunner } from "typeorm";

export class ParentId1711567005425 implements MigrationInterface {
    name = 'ParentId1711567005425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "parent_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "parent_id"`);
    }

}
