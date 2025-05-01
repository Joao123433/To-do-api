import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiExceptionFilter } from 'src/commom/filters/exception-filter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: "APP_FILTER",
      useClass: ApiExceptionFilter
    }
  ],
})
export class AppModule {}
