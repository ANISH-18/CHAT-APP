import { MigrationInterface, QueryRunner } from "typeorm";

export class Role0change1711480165378 implements MigrationInterface {
    name = 'Role0change1711480165378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6620cd026ee2b231beac7cfe578" FOREIGN KEY ("role") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
