import {
  INestApplicationContext,
  Logger,
  WebSocketAdapter,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';

import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';
import { SocketStateService } from './socket-state.service';
import { OwnerDto } from '../../../../decorators/owner.decorator';
import { Job } from '../../../utils/job';
import { FireAuthService } from '../../firebase/auth/fire-auth.service';
import { UserService } from '../../../../modules/user/user.service';

export interface AuthenticatedSocket extends socketio.Socket {
  auth: OwnerDto;
}

export class SocketStateFirebaseAdapter
  extends IoAdapter
  implements WebSocketAdapter
{
  private readonly logger = new Logger('AppGateway');

  public constructor(
    readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly userService: UserService,
    private readonly fireAuthService: FireAuthService,
  ) {
    super(app);
  }

  public create(
    port: number,
    options: socketio.ServerOptions = {},
  ): socketio.Server {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        // guest login
        socket.auth = null;
        return next();
      }
      try {
        const { error: validateError, data: session } =
          await this.fireAuthService.verifyIdToken(
            new Job({
              payload: {
                idToken: token,
              },
            }),
          );
        if (!!validateError) {
          socket.disconnect();
          return next(validateError);
        }
        const { error, data } = await this.userService.findOneRecord(
          new Job({
            options: {
              where: {
                firebase_id: session.uid,
              },
              allowEmpty: true,
            },
          }),
        );
        if (!!error || !data || !data.active) {
          socket.disconnect();
          return next(validateError);
        }
        socket.auth = { ...data.toJSON(), userId: data.id };
        socket.join(`ROLE_${data.role_id}`);
        return next();
      } catch (e) {
        return next(e);
      }
    });
    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: any): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(`${socket.auth.userId}`, socket);
        socket.on('disconnect', () => {
          this.socketStateService.remove(`${socket.auth.userId}`, socket);
          socket.removeAllListeners('disconnect');
        });
      }
      callback(socket);
    });
  }

  public joinRoom({ uid, room }) {
    const sockets = this.socketStateService.get(uid);
    if (sockets && sockets.length) {
      for (const socket of sockets) {
        socket.join(room);
      }
      this.logger.log(`UID ${uid} join room ${room}`);
    }
  }

  public leaveRoom({ uid, room }) {
    const sockets = this.socketStateService.get(uid);
    if (sockets && sockets.length) {
      for (const socket of sockets) {
        socket.leave(room);
      }
      this.logger.log(`UID ${uid} left room ${room}`);
    }
  }

  public sendToRoom({ chanel, room, payload }) {
    socketio().in(room).emit(chanel, payload);
    this.logger.log(`Message sent to room ${room} chanel ${chanel}`);
    this.logger.log(payload);
  }

  public broadcast({ chanel, payload }) {
    socketio().emit(chanel, payload);
    this.logger.log(`Broadcasted to chanel ${chanel}`);
    this.logger.log(payload);
  }
}
