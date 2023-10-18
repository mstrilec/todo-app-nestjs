import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumns1697612819927 implements MigrationInterface {
    name = 'AddEmailColumns1697612819927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isEmailConfirmed\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`emailConfirmationToken\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_f103f1e4534e4f4b342f5763c4\` (\`emailConfirmationToken\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_f103f1e4534e4f4b342f5763c4\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`emailConfirmationToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isEmailConfirmed\``);
    }

}
