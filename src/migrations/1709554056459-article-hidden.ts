import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleHidden1709554056459 implements MigrationInterface {
    name = 'ArticleHidden1709554056459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "hidden" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "hidden"`);
    }

}
