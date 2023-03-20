/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.dropColumns('users', ['phone_number'],
        { ifExists: true},
    );

    pgm.addColumns('users', {
        google_id: {
            type: 'integer'
        },
        facebook_id: {
            type: 'integer'
        }
    });

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
