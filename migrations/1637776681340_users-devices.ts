/* eslint-disable @typescript-eslint/camelcase */
import { UUID_ID_FIELD } from '../migration_common/uuid_id_field';
import { MigrationBuilder, ColumnDefinitions, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'users_devices',
        {
          ...UUID_ID_FIELD,
          user_id: {
            type: 'uuid',
            references: 'users',
            referencesConstraintName: 'FK_users_devices_users',
          },
          registration_token: {
            type: 'varchar',
            notNull: true,
          },
          created_at: {
            type: 'timestamptz',
            notNull: true,
            default: new PgLiteral('NOW()'),
          }
        },
        { ifNotExists: true },
      );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
