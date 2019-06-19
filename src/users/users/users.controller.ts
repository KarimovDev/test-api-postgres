import { Controller, Get } from '@nestjs/common';
import { Note } from '../note.entity';
import { UsersService } from '../users/users.service';
import { Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ValidateObject } from '../user.pipes';
import { User } from '../user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async index(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    async create(@Body() note: Note): Promise<any> {
        return this.usersService.create(note);
    }

    @Put(':id')
    async update(@Param('id') id, @Body() note: Note): Promise<any> {
        note.id = Number(id);
        return this.usersService.update(note);
    }

    @Delete(':id')
    async delete(@Param('id') id): Promise<any> {
        return this.usersService.delete(id);
    }
}
