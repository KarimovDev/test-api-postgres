import { Module, HttpModule } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config.module';
import { Note } from './note.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Note]), HttpModule, ConfigModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
