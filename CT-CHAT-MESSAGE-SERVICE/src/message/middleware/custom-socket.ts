import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  user_id?: string;
  role?: number;
}
