import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreatePostFileUploadIndexesTable1686315511270
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('post_file_uploads_indexes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'post_file_uploads_indexes',
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
          ],
          indices: [
            {
              name: 'IDX_POST_FILE_UPLOAD_IDs',
              columnNames: ['id'],
            },
          ],
        }),
      );

      await queryRunner.addColumn(
        'post_file_uploads_indexes',
        new TableColumn({
          name: 'post_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'post_file_uploads_indexes',
        new TableForeignKey({
          columnNames: ['post_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'posts',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.addColumn(
        'post_file_uploads_indexes',
        new TableColumn({
          name: 'upload_file_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      await queryRunner.createForeignKey(
        'post_file_uploads_indexes',
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
    if (await queryRunner.hasTable('post_file_uploads_indexes')) {
      const table = await queryRunner.getTable('post_file_uploads_indexes');

      const uploadFileForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('upload_file_id'),
      );
      const postForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('post_id'),
      );

      if (uploadFileForeignKey) {
        await queryRunner.dropForeignKey(
          'post_file_uploads_indexes',
          uploadFileForeignKey,
        );
      }

      if (postForeignKey) {
        await queryRunner.dropForeignKey(
          'post_file_uploads_indexes',
          postForeignKey,
        );
      }

      await queryRunner.dropTable('post_file_uploads_indexes');
    }
  }
}
