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
        'messages',
        {
          ...UUID_ID_FIELD,
          room: {
            type: 'uuid',
            references: 'rooms',
            referencesConstraintName: 'FK_messages_rooms',
          },
          from: {
            type: 'text',
            notNull: true,
          },
          content: {
            type: 'text',
            notNull: true,
          },
          location: {
            type: 'point',
          },
          user: {
            type: 'uuid',
            references: 'users',
            referencesConstraintName: 'FK_messages_users',
          },
          nickname: {
            type: 'varchar',
            notNull: true,
          },
          is_deleted: {
            type: 'boolean',
            default: false,
            notNull: true,
          },
          ...TIMESTAMP_FIELDS,
        },
        { ifNotExists: true },
      );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('messages', { ifExists: true, cascade: true });
}
