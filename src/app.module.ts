import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AssetsModule } from './assets/assets.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
      connectTimeoutMS: 10000, // Set a higher timeout
      retryAttempts: 3, // Add retry attempts
      retryDelay: 3000,
      extra: {
        max: 50, // Set the max pool size
      },
      entities: [join(__dirname, './**/**.entity{.ts,.js}')],
    }),
    CacheModule.register({ isGlobal: true }),
    UserModule,
    AuthModule,
    AssetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
