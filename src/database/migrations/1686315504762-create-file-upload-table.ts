import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFileUploadTable1686315504762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('file_uploads'))) {
      await queryRunner.createTable(
        new Table({
          name: 'file_uploads',
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
              name: 'file_name',
              type: 'varchar',
            },
            {
              name: 'image_url',
              type: 'varchar',
            },
            {
              name: 'mime_type',
              type: 'varchar',
            },
            {
              name: 'original_name',
              type: 'varchar',
            },
          ],
          indices: [
            {
              name: 'IDX_FILE_UPLOAD_IDs',
              columnNames: ['id'],
            },
            {
              name: 'IDX_FILE_UPLOAD_NAMES',
              columnNames: ['file_name', 'image_url'],
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('file_uploads')) {
      await queryRunner.dropTable('file_uploads');
    }
  }
}
