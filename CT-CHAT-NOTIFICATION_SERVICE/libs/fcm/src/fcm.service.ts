import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { serviceAccount } from './config/firebase.config';
import { error } from 'console';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  private firebaseApp: admin.app.App;

  constructor() {
    this.initializeFirebaseAdmin();
  }

  //FireBase Initialization
  private initializeFirebaseAdmin() {
    try {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
    }
  }

  //send Notifcation
  async sendFCMNotification(
    token: string,
    payload: {
      notification?: admin.messaging.Notification;
      data?: { [key: string]: string };
      android?: admin.messaging.AndroidConfig;
    },
  ) {
    try {
      Logger.log('INSIDE FCM NOTIFICATION ', payload,"token", token);

      const response = await admin
        .messaging()
        .send({ token, notification: payload.notification, data: payload.data, android: payload.android  }).then((response)=> {
          Logger.log("FCM NOTIFICATION SEND SUCCESSFULLY..", response)
        }).catch((error)=> {
          Logger.warn("ERROR WHILE SENDING FCM NOTIFICATIOn", error)
        })
    } catch (error) {
      throw error;
    }
  }
}
