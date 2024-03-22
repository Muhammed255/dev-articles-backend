import { MigrationInterface, QueryRunner } from "typeorm";

export class TopicCloudinaryId1707815928733 implements MigrationInterface {
    name = 'TopicCloudinaryId1707815928733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" ADD "cloudinary_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "cloudinary_id"`);
    }

}
