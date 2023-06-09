import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateUserFileUploadIndexesTable1686319926201
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('user_file_uploads_indexes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'user_file_uploads_indexes',
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
          ],
          indices: [
            {
              name: 'IDX_USER_FILE_UPLOAD_IDs',
              columnNames: ['id'],
            },
          ],
        }),
      );

      await queryRunner.addColumn(
        'user_file_uploads_indexes',
        new TableColumn({
          name: 'user_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'user_file_uploads_indexes',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.addColumn(
        'user_file_uploads_indexes',
        new TableColumn({
          name: 'upload_file_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      await queryRunner.createForeignKey(
        'user_file_uploads_indexes',
        new TableForeignKey({
          columnNames: ['upload_file_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'file_uploads',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('user_file_uploads_indexes')) {
      const table = await queryRunner.getTable('user_file_uploads_indexes');

      const uploadFileForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('upload_file_id'),
      );
      const userForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );

      if (uploadFileForeignKey) {
        await queryRunner.dropForeignKey(
          'user_file_uploads_indexes',
          uploadFileForeignKey,
        );
      }

      if (userForeignKey) {
        await queryRunner.dropForeignKey(
          'user_file_uploads_indexes',
          userForeignKey,
        );
      }

      await queryRunner.dropTable('user_file_uploads_indexes');
    }
  }
}
