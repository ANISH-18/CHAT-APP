import { WsJwtGuard } from '@jwt_auth';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomSocket } from './custom-socket';

export type SocketIOMiddleWare = {
  (client: Socket, next: (err?: any) => void): void;
};
export const SocketAuthMiddleware = (): SocketIOMiddleWare => {
  return async (client: CustomSocket, next) => {
    try {
      //Get DECODED TOKEN
      const decodedToken = await WsJwtGuard.validateToken(client);
      // Logger.log('inws middleware');
      // Logger.log('Decoded Token', decodedToken);

      // const user_id = decodedToken.sub;
      const user_id =
        typeof decodedToken.sub === 'function'
          ? decodedToken.sub()
          : decodedToken.sub;

      const role =
        typeof decodedToken === 'object' &&
        decodedToken !== null &&
        'role' in decodedToken
          ? typeof decodedToken.role === 'function'
            ? decodedToken.role()
            : decodedToken.role
          : null;

      client.user_id = user_id;
      client.role = role;

      next();
    } catch (error) {
      next(error);
    }
  };
};
