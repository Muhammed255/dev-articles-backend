import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersLikedPosts1707943040267 implements MigrationInterface {
    name = 'UsersLikedPosts1707943040267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_liked_posts" ("id" SERIAL NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "postId" integer NOT NULL, "userId" integer NOT NULL, "articleId" integer, CONSTRAINT "PK_6003f72a5bc0dd0634c6ce9470a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastChangedBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "replies" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "replies" ADD "createdBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "replies" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "replies" ADD "lastChangedBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "createdBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "lastChangedBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "createdBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "article_posts" ADD "lastChangedBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "createdBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "lastChangedBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "lastChangedBy" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "users_liked_posts" ADD CONSTRAINT "FK_ff99592fdc9fcdf6c4390edaf4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_liked_posts" ADD CONSTRAINT "FK_58bdedd067f0dfdc98abbd99101" FOREIGN KEY ("articleId") REFERENCES "article_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_liked_posts" DROP CONSTRAINT "FK_58bdedd067f0dfdc98abbd99101"`);
        await queryRunner.query(`ALTER TABLE "users_liked_posts" DROP CONSTRAINT "FK_ff99592fdc9fcdf6c4390edaf4e"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "article_posts" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "users_liked_posts"`);
    }

}
