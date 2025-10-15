import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDeletedAt1712752882096 implements MigrationInterface {
    name = 'AddedDeletedAt1712752882096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    }

}
