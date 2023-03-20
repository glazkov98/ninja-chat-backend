import { MessageCount } from 'src/db/interfaces/message-count.interface';

export interface RoomUser {
  id: string;
  name: string;
  type: string;
  owner: string;
  lastMessageContent?: string;
  lastMessageDate?: string;
  lastMessageDeleted?: boolean;
  countUnreadMessages: MessageCount;
  members?: string[];
}
