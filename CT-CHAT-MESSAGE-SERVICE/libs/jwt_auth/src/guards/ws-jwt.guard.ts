import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    // //HANDSHAKE FOR CLIENT AUTH WHILE HEADERS FOR POSTMAN
    // // client.handshake.authorization = authorization;
    // const token = client.handshake.headers.authorization.split(' ')[1];

    const client: Socket = context.switchToWs().getClient();
    Logger.log('Online Users Event');
    // const { authorization } = client.handshake.headers;

    WsJwtGuard.validateToken(client);

    // Logger.log(`Authorization: ${authorization}`);
    return false;
  }
  //next stage TCP call to validate auth token
  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    Logger.log("client.handshake.auth.token value => ", client.handshake.auth.token);

    const token: string = authorization.split(' ')[1] || client.handshake.auth.token;
    if (!token) {
      Logger.log('TOKEN IS NOT PRESENT');
    }

    const secretKey = process.env.JWT_ACCESS_SECRET;
    const payload = verify(token, secretKey);
    // Logger.log(payload, 'PAYLOAD IN WSJWT');
    return payload;
  }
}
