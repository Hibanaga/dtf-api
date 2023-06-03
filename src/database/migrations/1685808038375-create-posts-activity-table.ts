import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { ReactionType } from '../../models/PostActivity';

export class CreatePostsActivityTable1685808038375
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('post_activities_indexes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'post_activities_indexes',
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
              name: 'IDX_REACTION_TYPES',
              columnNames: ['reaction_type'],
            },
          ],
        }),
      );

      await queryRunner.addColumn(
        'post_activities_indexes',
        new TableColumn({
          name: 'post_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'post_activities_indexes',
        new TableForeignKey({
          columnNames: ['post_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'posts',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.addColumn(
        'post_activities_indexes',
        new TableColumn({
          name: 'user_id',
          type: 'uuid',
        }),
      );

      await queryRunner.createForeignKey(
        'post_activities_indexes',
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
    if (await queryRunner.hasTable('post_activities_indexes')) {
      const table = await queryRunner.getTable('post_activities_indexes');

      const userForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );
      const postForeignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('post_id'),
      );

      if (userForeignKey) {
        await queryRunner.dropForeignKey(
          'post_activities_indexes',
          userForeignKey,
        );
      }

      if (postForeignKey) {
        await queryRunner.dropForeignKey(
          'post_activities_indexes',
          postForeignKey,
        );
      }
      await queryRunner.dropTable('post_activities_indexes');
    }
  }
}
