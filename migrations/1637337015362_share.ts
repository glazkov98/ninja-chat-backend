/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('messages', {
        share: {
            type: 'boolean',
            default: false,
            notNull: true,
        },
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
