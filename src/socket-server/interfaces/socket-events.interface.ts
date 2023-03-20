import { ReverseMap } from './reverse-map';

export enum ESocketEvents {
  Message = 'message',
  MessageGeoRoom = 'message_geo_room',
  UserExit = 'USER_EXIT',
  UserOffline = 'USER_OFFLINE',
  UserOnline = 'USER_ONLINE',
  UserJoin = 'USER_JOIN',
  UpdateRoomName = 'UPDATE_ROOM_NAME',
}

const reverseMap: ReverseMap<typeof ESocketEvents> = Object.entries(
  ESocketEvents,
).reduce((rMap, [k, v]) => {
  rMap[v] = k;
  return rMap;
}, {} as any);

export type SocketEventsInterface = keyof typeof reverseMap;

export const SOCKET_EVENTS: SocketEventsInterface[] = Object.values(
  ESocketEvents,
);

export interface ISocketEventUserConnected {
  userId: string;
}
