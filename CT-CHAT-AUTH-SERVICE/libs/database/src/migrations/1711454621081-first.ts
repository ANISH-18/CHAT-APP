import { MigrationInterface, QueryRunner } from "typeorm";

export class First1711454621081 implements MigrationInterface {
    name = 'First1711454621081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("cred_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "email" character varying NOT NULL, "password" character varying, "username" character varying, "org_id" integer, "role_id" integer, "lastLoginAt" character varying, "refresh_token" text, "reset_token" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2477c67248457ca142cf1bc1765" PRIMARY KEY ("cred_id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("client_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_secret_key" character varying, "api_key" character varying, "org_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_7510ce0a84bde51dbff978b4b49" PRIMARY KEY ("client_id"))`);
        await queryRunner.query(`CREATE TABLE "authorization" ("auth_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "auth_code" character varying, "user_id" character varying, "state" character varying, "isExpired" character varying, "ipAddress" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6bc0e5fe05e481257e3236f8005" PRIMARY KEY ("auth_id"))`);
        await queryRunner.query(`CREATE TABLE "auth_logs" ("log_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "auth_code" character varying, "event_type" character varying, "ip_address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_225a0d2892703cf72423094a31c" PRIMARY KEY ("log_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth_logs"`);
        await queryRunner.query(`DROP TABLE "authorization"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
