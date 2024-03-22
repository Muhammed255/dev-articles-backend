import { MigrationInterface, QueryRunner } from "typeorm";

export class IsPublic1708104837318 implements MigrationInterface {
    name = 'IsPublic1708104837318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "is_public" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "is_public"`);
    }

}
