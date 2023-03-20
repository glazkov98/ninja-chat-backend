import { Injectable } from '@nestjs/common';
import { PgClient } from 'src/common/connectors/factory/pg.factory';
import { inCamelCase } from '../../common/camelize';
import { User } from '../interfaces/user.interface';
import { CreateUserRequestDto } from 'src/user/dto/create-user.request.dto';
import { LatLng } from '../interfaces/lat-lng.interface';
import { UserId } from '../interfaces/user-id.interface';

@Injectable()
export class UserQueryService {
  constructor(private pgClient: PgClient) {}

  @inCamelCase()
  async createUser(dto: CreateUserRequestDto): Promise<User> {
    const { socialId, type } = dto;
    const socialField = `${type}_id`;
    // language=PostgreSQL
    const query = `
        INSERT INTO users (${socialField})
        VALUES ($1)
        RETURNING id, google_id, facebook_id, created_at
    `;

    return this.pgClient.row<User>(query, [socialId]);
  }

  @inCamelCase()
  async setUserLastCoords(userId: string, coords: LatLng): Promise<User> {
    // language=PostgreSQL
    const query = `
        UPDATE users
        SET last_coords = ST_Point($2, $1)
        WHERE id = $3
        RETURNING id, 
            google_id, 
            facebook_id, 
            json_build_object('lng', st_x(last_coords), 'lat', st_y(last_coords)) as last_coords, 
            created_at;
    `;

    return this.pgClient.row<User>(query, [
      coords?.lat || null,
      coords?.lng || null,
      userId,
    ]);
  }

  @inCamelCase()
  async getUserById(id: string): Promise<User> {
    // language=PostgreSQL
    const query = `
        SELECT id, google_id, facebook_id, last_coords, created_at
        FROM users
        WHERE id = $1
    `;

    return this.pgClient.row<User>(query, [id]);
  }

  getUserBySocialId(type: string, socialId: string): Promise<User> {
    const socialField = `${type}_id`;

    // language=PostgreSQL
    const query = `
        SELECT id, google_id, facebook_id, last_coords, created_at
        FROM users
        WHERE ${socialField} = $1
    `;

    return this.pgClient.row<User>(query, [socialId]);
  }

  @inCamelCase()
  async getAllUsersIds(): Promise<UserId[]> {
    // language=PostgreSQL
    const query = `
        SELECT id
        FROM users
    `;

    return this.pgClient.rows(query);
  }

  @inCamelCase()
  getUsersByLocation(coords: LatLng): Promise<string[]> {
    // language=PostgreSQL
    return this.pgClient.fieldValue<string[]>(
      `
        SELECT array_agg(u.id) as res
        FROM users u
        WHERE st_contains(
          ST_Buffer(ST_MakePoint($2, $1)::geography, 200)::geometry,
          u.last_coords::geometry
        )
      ;`,
      'res',
      [coords.lat, coords.lng],
    );
  }
}
