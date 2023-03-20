/* eslint-disable @typescript-eslint/camelcase */
import { UUID_ID_FIELD } from '../migration_common/uuid_id_field';
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createExtension('uuid-ossp', {
        ifNotExists: true,
    });

    pgm.createTable(
        'room_members',
        {
          ...UUID_ID_FIELD,
          user: {
            type: 'uuid',
            references: 'users',
            referencesConstraintName: 'FK_room_members_users',
          },
          room: {
            type: 'uuid',
            references: 'rooms',
            referencesConstraintName: 'FK_room_members_rooms',
          },
          is_deleted: {
            type: 'boolean',
            default: false,
            notNull: true,
          },
        },
        { ifNotExists: true },
      );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('room_members', { ifExists: true, cascade: true });
}
