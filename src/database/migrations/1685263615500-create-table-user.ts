import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { Gender } from '../../models/User';

export class CreateTableUser1685263615500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('user'))) {
      await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              isNullable: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'first_name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'last_name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'image_url',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'gender',
              type: 'enum',
              enum: [...Object.values(Gender)],
              isNullable: true,
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('user')) {
      await queryRunner.dropTable('user');
    }
  }
}
