import { Injectable } from '@nestjs/common';
import { inCamelCase } from 'src/common/camelize';
import { PgClient } from 'src/common/connectors/factory/pg.factory';
import { Push } from '../interfaces/push.interface';
import { Room } from '../interfaces/room.interface';
import { User } from '../interfaces/user.interface';

@Injectable()
export class PushQueryService {
    constructor(private pgClient: PgClient) {}

    @inCamelCase()
    add(userId: User['id'], token: Push['registrationToken']): Promise<Push> {
        // language=PostgreSQL
        const query = `
            INSERT INTO users_devices (user_id, registration_token)
            VALUES ($1, $2)
            RETURNING id, user_id, registration_token, created_at
        `;

        return this.pgClient.row<Push>(query, [
            userId,
            token
        ]);
    }

    @inCamelCase()
    update(userId: User['id'], token: Push['registrationToken']): Promise<Push> {
        // language=PostgreSQL
        const query = `
            UPDATE users_devices
            SET user_id = $1, registration_token = $2
            WHERE user_id = $1
            RETURNING id, user_id, registration_token, created_at
        `;

        return this.pgClient.row<Push>(query, [
            userId,
            token
        ]);
    }

    async check(userId: User['id']): Promise<boolean> {
        // language=PostgreSQL
        const query = `
            SELECT * FROM users_devices
            WHERE user_id = $1
        `;

        const result = await this.pgClient.row(query, [
            userId
        ]);

        if (result) return true;
        return false;
    }

    @inCamelCase()
    getTokensForRoomId(roomId: Room['id']): Promise<Push[]> {
        // language=PostgreSQL
        const query = `
            SELECT
                ud.registration_token,
                ud.user_id
            FROM "users_devices" ud
            INNER JOIN "room_members" rm
                ON rm.user_id = ud.user_id
            WHERE rm.room = $1
        `;

        return this.pgClient.rows(query, [
            roomId
        ]);
    }

}