/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('users', {
        last_coords: {
            type: 'point'
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
