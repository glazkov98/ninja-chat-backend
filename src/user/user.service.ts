import { Injectable } from '@nestjs/common';
import { UserQueryService } from 'src/db/services/user.query.service';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { User } from '../db/interfaces/user.interface';
import { LatLng } from 'src/db/interfaces/lat-lng.interface';

@Injectable()
export class UserService {

  constructor(private userQueryService: UserQueryService) {}

  async createUser(dto: CreateUserRequestDto): Promise<User> {
    return this.userQueryService.createUser(dto);
  }

  async getUserById(id: string): Promise<User> {
    return this.userQueryService.getUserById(id);
  }

  async getUserBySocialId(type: string, socialId: string): Promise<User> {
    return this.userQueryService.getUserBySocialId(type, socialId);
  }

  async setUserLastCoords(userId: string, coords: LatLng): Promise<User> {
    return this.userQueryService.setUserLastCoords(userId, coords);
  }

  async getAllUsersIds(): Promise<string[]> {
    const queryUsersIds = await this.userQueryService.getAllUsersIds();
    const usersIds = [];

    queryUsersIds.forEach(user => {
      usersIds.push(user.id);
    });

    return usersIds;
  }

  async getUsersByLocation(coords: LatLng): Promise<string[]> {
    return this.userQueryService.getUsersByLocation(coords);
  }
}
