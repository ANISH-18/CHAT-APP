import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstTable1711450399672 implements MigrationInterface {
    name = 'FirstTable1711450399672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("org_id" SERIAL NOT NULL, "org_name" character varying NOT NULL, "email" character varying NOT NULL, "website" character varying, "logo" character varying, "isactive" integer, "createdby" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_5d06de67ef6ab02cbd938988bb1" UNIQUE ("email"), CONSTRAINT "PK_9e79847fb4b5883cf2f2f020079" PRIMARY KEY ("org_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ref_userId" integer NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "username" character varying, "phone_number" character varying, "profile_pic" character varying, "address" character varying, "city" character varying, "country" character varying, "isactive" character varying, "isonline" character varying, "refresh_token" text, "reset_token" text, "last_login_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "org_id" integer, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("role_id" SERIAL NOT NULL, "parent_id" integer NOT NULL, "role_name" character varying NOT NULL, "createdby" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "org_id" integer, CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("permission_id" SERIAL NOT NULL, "canChat" integer, "createdby" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role_A" integer, "role_B" integer, CONSTRAINT "PK_aaa6d61e22fb453965ae6157ce5" PRIMARY KEY ("permission_id"))`);
        await queryRunner.query(`CREATE TABLE "userRoles" ("userRoleId" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "org_id" integer, "user_id" uuid, "role" integer, CONSTRAINT "PK_3d8494f390ed9a638975ac60acb" PRIMARY KEY ("userRoleId"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9f695092793e9177b98621da0be" FOREIGN KEY ("org_id") REFERENCES "organization"("org_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_ba4f96af4628cc8b18e940436d8" FOREIGN KEY ("org_id") REFERENCES "organization"("org_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_97b623bf2fc3f29e513f98b6a00" FOREIGN KEY ("role_A") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_e329d1c3ddad981fe0318b434c6" FOREIGN KEY ("role_B") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_5fcb3a5e3a538b3f0d74f62cea1" FOREIGN KEY ("org_id") REFERENCES "organization"("org_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_355bdf8bfdd624c430cdd1a2299" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_d37bfa6122843e37f87df6b74d3" FOREIGN KEY ("role") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_d37bfa6122843e37f87df6b74d3"`);
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_355bdf8bfdd624c430cdd1a2299"`);
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_5fcb3a5e3a538b3f0d74f62cea1"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_e329d1c3ddad981fe0318b434c6"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_97b623bf2fc3f29e513f98b6a00"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_ba4f96af4628cc8b18e940436d8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9f695092793e9177b98621da0be"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
