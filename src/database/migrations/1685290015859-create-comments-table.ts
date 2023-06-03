import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateCommentsTable1685290015859 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('comments'))) {
      await queryRunner.createTable(
        new Table({
          name: 'comments',
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
              name: 'message',
              type: 'varchar',
            },
            {
              name: 'like_count',
              type: 'integer',
              default: 0,
            },
            {
              name: 'dislike_count',
              type: 'integer',
              default: 0,
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
          ],
        }),
      );

      await queryRunner.addColumn(
        'comments',
        new TableColumn({
          name: 'user_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'comments',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.addColumn(
        'comments',
        new TableColumn({
          name: 'post_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'comments',
        new TableForeignKey({
          columnNames: ['post_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('comments')) {
      const table = await queryRunner.getTable('comments');

      const userForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );
      const postForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('post_id'),
      );

      if (userForeignKey) {
        await queryRunner.dropForeignKey('comments', userForeignKey);
      }

      if (postForeignKey) {
        await queryRunner.dropForeignKey('comments', postForeignKey);
      }

      await queryRunner.dropTable('comments');
    }
  }
}
