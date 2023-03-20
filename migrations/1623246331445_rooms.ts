/* eslint-disable @typescript-eslint/camelcase */
import { TIMESTAMP_FIELDS } from '../migration_common/timestamp.fields';
import { UUID_ID_FIELD } from '../migration_common/uuid_id_field';
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createExtension('uuid-ossp', {
        ifNotExists: true,
    });

    pgm.createTable(
        'rooms',
        {
          ...UUID_ID_FIELD,
          name: {
            type: 'varchar',
            notNull: true,
          },
          type: {
            type: 'integer',
            notNull: true,
            references: 'room_types',
            referencesConstraintName: 'FK_rooms_room_types',
          },
          is_deleted: {
            type: 'boolean',
            default: false,
            notNull: true,
          },
          owner: {
            type: 'uuid',
            references: 'users',
            referencesConstraintName: 'FK_rooms_users',
          },
          ...TIMESTAMP_FIELDS,
        },
        { ifNotExists: true },
      );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('rooms', { ifExists: true, cascade: true });
}
