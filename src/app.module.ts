import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { CrudModule } from './crud/crud.module';
import { SeedModule } from './seed/seed.module';
import { AuthMiddleware } from './common/auth.middleware';
import { HealthController } from './common/health.controller';

@Module({
  imports: [AuthModule, DataModule, CrudModule, SeedModule],
  controllers: [HealthController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL }, { path: 'health', method: RequestMethod.GET })
      .forRoutes('data', 'seed', ':table');
  }
}
