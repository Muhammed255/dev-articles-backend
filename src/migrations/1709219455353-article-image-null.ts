import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleImageNull1709219455353 implements MigrationInterface {
    name = 'ArticleImageNull1709219455353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_posts" ALTER COLUMN "article_image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article_posts" ALTER COLUMN "cloudinary_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_posts" ALTER COLUMN "cloudinary_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article_posts" ALTER COLUMN "article_image" SET NOT NULL`);
    }

}
