import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config.module';
import { RedisModule } from 'nestjs-redis';

@Module({
    imports: [
        UsersModule,
        ConfigModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'sa',
            database: 'db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        RedisModule.register({}),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
