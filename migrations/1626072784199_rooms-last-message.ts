/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.addColumns('rooms', {
        last_message: {
            type: 'uuid',
            references: 'messages',
            referencesConstraintName: 'FK_rooms_messages',
        },
    })

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
