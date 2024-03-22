import { MigrationInterface, QueryRunner } from "typeorm";

export class Bookmark1707923520271 implements MigrationInterface {
    name = 'Bookmark1707923520271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_bookmarks_article_posts" ("usersId" integer NOT NULL, "articlePostsId" integer NOT NULL, CONSTRAINT "PK_b6044ec4432bac5d96e7539aea9" PRIMARY KEY ("usersId", "articlePostsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aff9069b4284a98cdc4f0c5a7f" ON "users_bookmarks_article_posts" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c13add490fe9abd26a9d59d82" ON "users_bookmarks_article_posts" ("articlePostsId") `);
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "topicId" integer`);
        await queryRunner.query(`ALTER TABLE "article_posts" ADD CONSTRAINT "FK_6b66300f09c9cb08d479b9bb0f5" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_bookmarks_article_posts" ADD CONSTRAINT "FK_aff9069b4284a98cdc4f0c5a7f2" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_bookmarks_article_posts" ADD CONSTRAINT "FK_9c13add490fe9abd26a9d59d828" FOREIGN KEY ("articlePostsId") REFERENCES "article_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_bookmarks_article_posts" DROP CONSTRAINT "FK_9c13add490fe9abd26a9d59d828"`);
        await queryRunner.query(`ALTER TABLE "users_bookmarks_article_posts" DROP CONSTRAINT "FK_aff9069b4284a98cdc4f0c5a7f2"`);
        await queryRunner.query(`ALTER TABLE "article_posts" DROP CONSTRAINT "FK_6b66300f09c9cb08d479b9bb0f5"`);
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "topicId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c13add490fe9abd26a9d59d82"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aff9069b4284a98cdc4f0c5a7f"`);
        await queryRunner.query(`DROP TABLE "users_bookmarks_article_posts"`);
    }

}
