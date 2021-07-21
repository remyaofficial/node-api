import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  SequelizeHealthIndicator,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../../../decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private config: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: SequelizeHealthIndicator,
    private mongodb: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck('baseurl', this.config.get('baseURL'), {
          timeout: 800,
        }),
      () => this.db.pingCheck('database'),
      () => this.mongodb.pingCheck('mongo'),
      () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024),
    ]);
  }
}
