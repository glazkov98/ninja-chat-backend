/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        DELETE FROM room_members
        WHERE id IN
            (SELECT id
            FROM 
                (SELECT id,
                ROW_NUMBER() OVER(PARTITION BY user_id, room
                ORDER BY id) AS row_num
                FROM room_members) t
                WHERE t.row_num > 1);
    `);
    pgm.sql(`
        ALTER TABLE room_members DROP CONSTRAINT IF EXISTS UC_room_members_user_id_room;
        ALTER TABLE room_members ADD CONSTRAINT UC_room_members_user_id_room UNIQUE (user_id, room);
    `);

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
