import { Injectable } from '@nestjs/common';
import { PgClient } from 'src/common/connectors/factory/pg.factory';
import { inCamelCase } from '../../common/camelize';
import { RoomMemberRequestDto } from 'src/room/dto/room-member.request.dto';
import { Room } from '../interfaces/room.interface';
import { RoomUser } from '../interfaces/room-user.interface';
import { RoomTypeId } from '../interfaces/room-type-id.interface';

@Injectable()
export class RoomQueryService {
  constructor(private pgClient: PgClient) {}

  @inCamelCase()
  async createRoom(
    roomId: string,
    name: string,
    type: string,
    userId: string,
  ): Promise<Room> {
    // language=PostgreSQL
    const query = `
        INSERT INTO rooms (
           id,                
           name, 
           type, 
           owner
        )
        VALUES (
          $1,      
          $2, 
          (SELECT rt.id FROM room_types rt WHERE ident = $3), 
          $4
        )
        RETURNING id, name, type, owner;
    `;

    return this.pgClient.row<Room>(query, [roomId, name, type, userId]);
  }

  @inCamelCase()
  async getRoom(roomId: string): Promise<Room> {
    // language=PostgreSQL
    const query = `
        SELECT r.id,
               r.name,
               rt.ident "type",
               r.owner,
               CASE
                WHEN rt.ident != 'geo'
                THEN
                (
                  SELECT array_agg(rm.user_id)
                  FROM room_members rm
                  WHERE rm.room = r.id
                )
                ELSE null
                END AS members,
              r.is_deleted
        FROM "rooms" r
        INNER JOIN "room_types" rt
        ON r.type = rt.id
        WHERE r.id = $1
        AND r.is_deleted = false
    `;

    return this.pgClient.row<Room>(query, [roomId]);
  }

  @inCamelCase()
  async getTypeForIdent(typeIdent: string): Promise<RoomTypeId> {
    // language=PostgreSQL
    const query = `
        SELECT id
        FROM room_types
        WHERE ident = $1
    `;

    return this.pgClient.row<RoomTypeId>(query, [typeIdent]);
  }

  @inCamelCase()
  async getGeoRoom(): Promise<Room> {
    // language=PostgreSQL
    const query = `
      SELECT r.id,
             r.name,
             rt.ident "type"
      FROM "rooms" r
      INNER JOIN "room_types" rt
      ON r.type = rt.id
      WHERE rt.ident = 'geo'
      AND r.is_deleted = false
    `;

    return this.pgClient.row(query);
  }

  @inCamelCase()
  async getCountMembersForRoom(roomId: string): Promise<number> {
    // language=PostgreSQL
    const query = `
        SELECT COUNT(id)
        FROM room_members
        WHERE room = $1
    `;

    const result = await this.pgClient.query(query, [roomId]);

    return result.rows[0].count;
  }

  @inCamelCase()
  async addRoomMember(dto: RoomMemberRequestDto): Promise<boolean> {
    const { roomId, userId } = dto;
    // language=PostgreSQL
    const query = `
        INSERT INTO room_members (user_id, room)
        VALUES ($1, $2)
        RETURNING id
    `;

    const roomMember = this.pgClient.row(query, [userId, roomId]);

    if (roomMember) return true;
    return false;
  }

  @inCamelCase()
  async deleteRoomMember(dto: RoomMemberRequestDto): Promise<boolean> {
    const { roomId, userId } = dto;
    // language=PostgreSQL
    const query = `
        UPDATE room_members
        SET is_deleted = true
        WHERE user_id = $1
        AND room = $2
        RETURNING id
    `;

    const roomMember = this.pgClient.row(query, [userId, roomId]);

    if (roomMember) return true;
    return false;
  }

  @inCamelCase()
  async deleteRoom(userId: string, roomId: string): Promise<boolean> {
    // language=PostgreSQL
    const query = `
        UPDATE rooms
        SET is_deleted = true
        WHERE id = $1
        AND owner = $2
        RETURNING id
    `;

    const room = this.pgClient.row(query, [roomId, userId]);

    if (room) return true;
    return false;
  }

  @inCamelCase()
  async getRoomIdsForUser(userId: string): Promise<string[]> {
    // language=PostgreSQL
    const query = `
        SELECT array_agg(room) as "roomIds"
        FROM room_members
        WHERE user_id = $1
        AND is_deleted = false
    `;

    return this.pgClient.fieldValue<string[]>(query, 'roomIds', [userId]);
  }

  @inCamelCase()
  async getRoomsForUser(userId: string): Promise<RoomUser[]> {
    // language=PostgreSQL
    const query = `
        SELECT r.id,
            r.name,
            rt.ident as type,
            r.owner,
            CASE m.is_deleted
                WHEN true THEN null
                ELSE m.content
                END as last_message_content,
            m.created_at as last_message_date,
            m.is_deleted as last_message_deleted,
            (
                SELECT COUNT(id)
                FROM messages m2
                WHERE m2.room = rm.room AND m2.read = false
            ) as count_unread_messages,
            CASE
              WHEN rt.ident != 'geo'
              THEN
              (
                SELECT array_agg(rm2.user_id)
                FROM room_members rm2
                WHERE rm2.room = r.id
              )
              ELSE null
              END AS members
        FROM room_members rm
                INNER JOIN rooms r ON rm.room = r.id
                INNER JOIN room_types rt ON r.type = rt.id
                LEFT JOIN messages m ON m.id = r.last_message
        WHERE rm.user_id = $1
        AND rm.is_deleted = false
        AND r.is_deleted = false
        ORDER BY m.created_at DESC;
    `;

    return this.pgClient.rows(query, [userId]);
  }

  @inCamelCase()
  async updateRoomName(userId: string, roomId: string, name: string): Promise<Room> {
    // language=PostgreSQL
    const query = `
      UPDATE rooms
      SET name = $1
      WHERE id = $2
      AND owner = $3
      RETURNING id, name, owner
    `;

    return this.pgClient.row(query, [name, roomId, userId]);
  }
}
