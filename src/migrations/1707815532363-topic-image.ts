import { MigrationInterface, QueryRunner } from "typeorm";

export class TopicImage1707815532363 implements MigrationInterface {
    name = 'TopicImage1707815532363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "image"`);
    }

}
