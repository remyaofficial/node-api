import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
  public readonly userId?: number | string;
  public readonly roleId?: number | string;
  public readonly room?: string;
  public readonly socketId?: string;
}
