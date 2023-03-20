import { Injectable } from '@nestjs/common';
import { PgClient } from 'src/common/connectors/factory/pg.factory';
import { CreateMessageRequestDto } from '../../messages/dto/create-message.request.dto';
import { inCamelCase } from '../../common/camelize';
import { Message } from '../interfaces/message.interface';
import { MessageCount } from '../interfaces/message-count.interface';
import { LatLng } from '../interfaces/lat-lng.interface';

@Injectable()
export class MessagesQueryService {
  constructor(private pgClient: PgClient) {}

  @inCamelCase()
  createMessage(
    userId: string,
    dto: CreateMessageRequestDto,
  ): Promise<Message> {
    const { roomId, message, point, nickname } = dto;
    // language=PostgreSQL
    const query = `
        INSERT INTO messages (room, content, location, user_id, nickname)
        VALUES ($1, $2, ST_Point($4, $3), $5, $6)
        RETURNING 
            id, 
            room,
            content, 
            json_build_object('lng', $4, 'lat', $3) as location, 
            user_id, 
            nickname, 
            is_deleted, 
            read, 
            created_at
    `;

    return this.pgClient.row<Message>(query, [
      roomId,
      message,
      point?.lat || null,
      point?.lng || null,
      userId,
      nickname,
    ]);
  }

  @inCamelCase()
  createMessageForGeoRoom(
    userId: string,
    dto: CreateMessageRequestDto,
  ): Promise<Message> {
    const { message, point, nickname, share } = dto;
    // language=PostgreSQL
    const query = `
        INSERT INTO messages (room, content, location, share, user_id, nickname)
        VALUES ((SELECT r.id
                FROM "rooms" r
                INNER JOIN "room_types" rt
                ON r.type = rt.id
                WHERE rt.ident = 'geo'
                AND r.is_deleted = false), $1, ST_Point($3, $2), $4, $5, $6)
        RETURNING id, room, content, location, share, user_id, nickname, is_deleted, read, created_at
    `;

    return this.pgClient.row<Message>(query, [
      message,
      point?.lat || null,
      point?.lng || null,
      share,
      userId,
      nickname,
    ]);
  }

  @inCamelCase()
  getMessagesForRoom(roomId: string): Promise<Message[]> {
    // language=PostgreSQL
    return this.pgClient.rows<Message>(
      `
        SELECT id, room, content, location, share, user_id, nickname, created_at, updated_at 
        FROM messages
        WHERE room = $1 
        AND is_deleted = false
        ORDER BY created_at desc
      ;`,
      [roomId],
    );
  }

  @inCamelCase()
  getMessagesForGeoRoom(coords: LatLng): Promise<Message[]> {
    // language=PostgreSQL
    return this.pgClient.rows<Message>(
      `
        SELECT m.id, 
               m.room, 
               m.content,
               json_build_object('lat', $1::float, 'lng', $2::float) as location, 
               m.share, 
               m.user_id, 
               m.nickname, 
               m.created_at, 
               m.updated_at 
        FROM messages m
            LEFT JOIN rooms r on r.id = m.room
            LEFT JOIN room_types rt on r.type = rt.id
        WHERE rt.ident = 'geo'
        AND st_contains(
          ST_Buffer(ST_MakePoint($2, $1)::geography, 200)::geometry,
          m.location::geometry
        )
        AND m.is_deleted = false
        ORDER BY m.created_at desc
      ;`,
      [coords.lat, coords.lng],
    );
  }

  @inCamelCase()
  getLastMessageForRoom(roomId: string): Promise<Message> {
    // language=PostgreSQL
    return this.pgClient.row(
      `
        SELECT id, room, content, location, share, user_id, nickname, created_at, updated_at 
        FROM messages 
        WHERE room = $1 
          AND is_deleted = false 
        ORDER BY created_at DESC LIMIT 1;`,
      [roomId],
    );
  }

  @inCamelCase()
  readMessage(messageId: string): Promise<boolean> {
    // language=PostgreSQL
    const query = `
        UPDATE messages 
        SET read = true 
        WHERE id = $1 
        RETURNING read;
    `;

    return this.pgClient.fieldValue(query, 'read', [messageId]);
  }

  @inCamelCase()
  async readAllMessages(roomId: string): Promise<void> {
    // language=PostgreSQL
    await this.pgClient.query(
      `
        UPDATE messages 
        SET read = true 
        WHERE room = $1 
          AND read = false;`,
      [roomId],
    );
  }

  @inCamelCase()
  getCountUnreadMessages(roomId: string): Promise<MessageCount> {
    // language=PostgreSQL
    return this.pgClient.row<MessageCount>(
      `
        SELECT count(id) as count
        FROM messages 
        WHERE room = $1 
          AND read = false;`,
      [roomId],
    );
  }

  @inCamelCase()
  getCountUnreadMessagesForRoomType(roomType: string): Promise<MessageCount> {
    // language=PostgreSQL
    return this.pgClient.row<MessageCount>(
      `
        SELECT COUNT(m.id) as count
        FROM "messages" m 
            INNER JOIN "rooms" r ON m.room = r.id 
            INNER JOIN "room_types" rt ON r.type = rt.id 
        WHERE rt.ident = $1 AND read = false;`,
      [roomType],
    );
  }
}
