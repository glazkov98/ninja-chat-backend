/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // language=PostgreSQL
  pgm.sql(`
        CREATE OR REPLACE FUNCTION fn_room_update_last_message() RETURNS trigger AS $$
        BEGIN
            UPDATE rooms r
                SET last_message = NEW.id
            WHERE r.id = NEW.room;
            RETURN NEW;
        END
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS tg_room_update_last_message ON messages;
        CREATE CONSTRAINT TRIGGER tg_room_update_last_message AFTER INSERT ON messages
            DEFERRABLE INITIALLY DEFERRED
            FOR EACH ROW EXECUTE PROCEDURE fn_room_update_last_message();
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
