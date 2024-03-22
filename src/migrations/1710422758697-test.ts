import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1710422758697 implements MigrationInterface {
    name = 'Test1710422758697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_3f3aaa45827962b1988ba2cf29f"`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_3f3aaa45827962b1988ba2cf29f" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_3f3aaa45827962b1988ba2cf29f"`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_3f3aaa45827962b1988ba2cf29f" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
