import { Socket } from 'socket.io';
import { UserJwt } from './user-jwt.interface';

export interface SocketClient extends Socket {
  user: UserJwt;
  roomIds: Set<string>;
}
