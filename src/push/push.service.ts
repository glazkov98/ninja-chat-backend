import { Injectable } from '@nestjs/common';
import { Push } from 'src/db/interfaces/push.interface';
import { User } from 'src/db/interfaces/user.interface';
import { PushQueryService } from 'src/db/services/push.query.service';
import { PushSendData } from './interfaces/push-send-data.interface';
import { Room } from 'src/db/interfaces/room.interface';
import * as FCM from 'fcm-node';

@Injectable()
export class PushService {
  protected fcm;

  constructor(private pushQueryService: PushQueryService) {
    this.fcm = new FCM(process.env.FIREBASE_SERVER_KEY);
  }

  async add(
    userId: User['id'],
    token: Push['registrationToken'],
  ): Promise<Push> {
    const checkUser = await this.pushQueryService.check(userId);
    if (checkUser) {
      return this.pushQueryService.update(userId, token);
    } else {
      return this.pushQueryService.add(userId, token);
    }
  }

  async getTokens(roomId: Room['id']): Promise<Push[]> {
    return this.pushQueryService.getTokensForRoomId(roomId);
  }

  async send(pushSendData: PushSendData): Promise<void> {
    const { registrationToken, messageId, roomId, text } = pushSendData;

    const message = {
      to: registrationToken,
      // collapse_key: 'your_collapse_key',

      notification: {
        title: 'Title of your push notification',
        body: text,
      },

      data: {
        roomId,
        messageId,
      },
    };

    this.fcm.send(message, (err, response) => {
      if (err) {
        console.log('Something has gone wrong!');
      } else {
        console.log('Successfully sent with response: ', response);
      }
    });
  }
}
