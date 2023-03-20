/* eslint-disable @typescript-eslint/camelcase */
import {
  MigrationBuilder,
  ColumnDefinitions,
  PgLiteral,
} from 'node-pg-migrate';
import { TIMESTAMP_FIELDS } from '../migration_common/timestamp.fields';
import { UUID_ID_FIELD } from '../migration_common/uuid_id_field';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension('uuid-ossp', {
    ifNotExists: true,
  });

  pgm.createTable(
    'users',
    {
      ...UUID_ID_FIELD,
      phone_number: {
        type: 'varchar',
        notNull: true,
      },
      ...TIMESTAMP_FIELDS,
    },
    { ifNotExists: true },
  );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users', { ifExists: true, cascade: true });
}
