/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createTable(
        'room_types',
        {
          id: {
            type: 'serial',
            notNull: true,
            primaryKey: true,
          },
          ident: {
            type: 'varchar',
            notNull: true,
          },
          params: {
            type: 'jsonb',
          },
        },
        { ifNotExists: true },
      );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('room_types', { ifExists: true, cascade: true });
}
