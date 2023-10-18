import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultIsEmailConfirmed1697616678881 implements MigrationInterface {
    name = 'SetDefaultIsEmailConfirmed1697616678881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isEmailConfirmed\` \`isEmailConfirmed\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isEmailConfirmed\` \`isEmailConfirmed\` tinyint NOT NULL`);
    }

}
