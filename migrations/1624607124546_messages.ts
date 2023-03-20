/* eslint-disable @typescript-eslint/camelcase */
import { TIMESTAMP_FIELDS } from '../migration_common/timestamp.fields';
import { UUID_ID_FIELD } from '../migration_common/uuid_id_field';
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

  pgm.dropColumns('messages', ['from'],
    { ifExists: true},
  );

}

export async function down(pgm: MigrationBuilder): Promise<void> {

}
