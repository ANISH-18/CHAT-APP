import { MigrationInterface, QueryRunner } from "typeorm";

export class Role1711519509053 implements MigrationInterface {
    name = 'Role1711519509053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role_id" TO "role"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role" TO "role_id"`);
    }

}
