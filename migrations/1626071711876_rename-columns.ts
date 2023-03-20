/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`ALTER TABLE messages RENAME COLUMN "user" TO user_id;`);
    pgm.sql(`ALTER TABLE room_members RENAME COLUMN "user" TO user_id;`);

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
