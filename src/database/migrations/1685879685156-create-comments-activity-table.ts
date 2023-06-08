import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { ReactionType } from 'src/types/ActivityStatus';

export class CreateCommentsActivityTable1685879685156
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('comment_activities_indexes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'comment_activities_indexes',
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
              name: 'reaction_type',
              type: 'enum',
              enum: [...Object.values(ReactionType)],
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
              name: 'IDX_REACTION_TYPES_COMMENT',
              columnNames: ['reaction_type'],
            },
          ],
        }),
      );

      await queryRunner.addColumn(
        'comment_activities_indexes',
        new TableColumn({
          name: 'post_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'comment_activities_indexes',
        new TableForeignKey({
          columnNames: ['post_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'posts',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.addColumn(
        'comment_activities_indexes',
        new TableColumn({
          name: 'user_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'comment_activities_indexes',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.addColumn(
        'comment_activities_indexes',
        new TableColumn({
          name: 'comment_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'comment_activities_indexes',
        new TableForeignKey({
          columnNames: ['comment_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'comments',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('comment_activities_indexes')) {
      const table = await queryRunner.getTable('comment_activities_indexes');

      const userForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );
      const postForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('post_id'),
      );
      const commentForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('comment_id'),
      );

      if (userForeignKey) {
        await queryRunner.dropForeignKey(
          'comment_activities_indexes',
          userForeignKey,
        );
      }

      if (postForeignKey) {
        await queryRunner.dropForeignKey(
          'comment_activities_indexes',
          postForeignKey,
        );
      }

      if (commentForeignKey) {
        await queryRunner.dropForeignKey(
          'comment_activities_indexes',
          commentForeignKey,
        );
      }

      await queryRunner.dropTable('comment_activities_indexes');
    }
  }
}
