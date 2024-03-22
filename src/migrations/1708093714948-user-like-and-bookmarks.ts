import { MigrationInterface, QueryRunner } from "typeorm";

export class UserLikeAndBookmarks1708093714948 implements MigrationInterface {
    name = 'UserLikeAndBookmarks1708093714948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_liked_posts_type_enum" AS ENUM('like', 'dislike', 'bookmark')`);
        await queryRunner.query(`ALTER TABLE "users_liked_posts" ADD "type" "public"."users_liked_posts_type_enum" NOT NULL DEFAULT 'like'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_liked_posts" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."users_liked_posts_type_enum"`);
    }

}
