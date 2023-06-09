import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { Gender } from '../../models/User';

export class CreateTableUser1685263615500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('users'))) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
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
              name: 'email',
              type: 'varchar',
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'user_name',
              type: 'varchar',
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
              name: 'gender',
              type: 'enum',
              enum: [...Object.values(Gender)],
              isNullable: true,
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
          ],
          indices: [
            {
              name: 'IDX_USER_IDs',
              columnNames: ['id'],
            },
            {
              name: 'IDX_USER_NAMES',
              columnNames: ['email', 'user_name', 'first_name', 'last_name'],
            },
          ],
        }),
      );

      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'upload_file_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      if (await queryRunner.hasTable('file_uploads')) {
        await queryRunner.createForeignKey(
          'users',
          new TableForeignKey({
            columnNames: ['upload_file_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'file_uploads',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('users')) {
      const table = await queryRunner.getTable('users');

      const uploadFileForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('upload_file_id'),
      );

      if (uploadFileForeignKey) {
        await queryRunner.dropForeignKey('users', uploadFileForeignKey);
      }

      await queryRunner.dropTable('users');
    }
  }
}
