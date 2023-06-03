import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePostsTable1685267699325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('posts'))) {
      await queryRunner.createTable(
        new Table({
          name: 'posts',
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
              name: 'image_key',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'title',
              type: 'varchar',
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
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
          indices: [
            {
              name: 'IDX_POSTS_DATES',
              columnNames: ['created_at', 'updated_at'],
            },
            {
              name: 'IDX_POSTS_ACTIVITY',
              columnNames: ['like_count', 'dislike_count'],
            },
            {
              name: 'IDX_POSTS_NAMES',
              columnNames: ['title'],
            },
          ],
        }),
      );

      await queryRunner.addColumn(
        'posts',
        new TableColumn({
          name: 'user_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      await queryRunner.createIndex(
        'posts',
        new TableIndex({
          name: 'IDX_POSTS_IDs',
          columnNames: ['user_id'],
        }),
      );

      await queryRunner.createForeignKey(
        'posts',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('posts')) {
      const table = await queryRunner.getTable('posts');

      const foreignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey('posts', foreignKey);
      }

      await queryRunner.dropTable('posts');
    }
  }
}
