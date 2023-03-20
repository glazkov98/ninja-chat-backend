/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // language=PostgreSQL
  pgm.sql(`
    ALTER TABLE messages
      ALTER COLUMN location TYPE geometry(Point, 4326)
          USING ST_SetSRID(location::geometry,4326);

    ALTER TABLE users
        ALTER COLUMN last_coords TYPE geometry(Point, 4326)
            USING ST_SetSRID(last_coords::geometry,4326);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
