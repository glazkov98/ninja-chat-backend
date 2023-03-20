/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`INSERT INTO room_types (ident) VALUES ('single'), ('multiple'), ('geo') ON CONFLICT(ident) DO NOTHING;`);

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
