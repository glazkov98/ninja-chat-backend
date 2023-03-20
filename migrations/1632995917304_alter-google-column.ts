/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.alterColumn('users', 'google_id',
        {
            type: 'text'
        },
    );

    pgm.alterColumn('users', 'facebook_id',
        {
            type: 'text'
        },
    );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
