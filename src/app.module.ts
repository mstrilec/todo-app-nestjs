import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validationSchema } from './validation/validation.schema';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { createDataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataSourceOptions = await createDataSourceOptions(configService);
        return dataSourceOptions;
      },
    }),
    UserModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
