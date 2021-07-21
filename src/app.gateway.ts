import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { INestApplication, Logger, UseInterceptors } from '@nestjs/common';
import { Server } from 'socket.io';
import { RedisPropagatorInterceptor } from './core/modules/socket/redis-propagator/redis-propagator.interceptor';
import { SessionModule } from './core/modules/session/session.module';
import { SessionService } from './core/modules/session/session.service';
import { RedisPropagatorService } from './core/modules/socket/redis-propagator/redis-propagator.service';
import {
  SocketStateAdapter,
  AuthenticatedSocket,
} from './core/modules/socket/socket-state/socket-state.adapter';
import { SocketStateService } from './core/modules/socket/socket-state/socket-state.service';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);
  const userService = app.select(UserModule).get(UserService);
  const sessionService = app.select(SessionModule).get(SessionService);

  /**
   * Socket authentication using local jwt
   */
  app.useWebSocketAdapter(
    new SocketStateAdapter(
      app,
      socketStateService,
      redisPropagatorService,
      userService,
      sessionService,
    ),
  );

  return app;
};

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseInterceptors(RedisPropagatorInterceptor)
  @SubscribeMessage('events')
  handleEvents(): any {
    return { event: 'events', data: 'socket working' };
  }

  afterInit() {
    this.logger.log('Socket server ready');
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // On sockect disconnect, write your app buisness login here
  }

  handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connected: ${client.id}`);
    // On sockect connect, write your app buisness login here
  }
}
