import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { Note } from '../note.entity';
import { UsersService } from '../users/users.service';
import { Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ValidateOrderDirection } from '../user.pipes';
import { User } from '../user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':orderDirection')
    async index(
        @Param('orderDirection', new ValidateOrderDirection()) orderDirection,
    ): Promise<User[]> {
        return this.usersService.findAll(orderDirection);
    }

    @Post()
    async create(@Body() note: Note): Promise<any> {
        return this.usersService.create(note);
    }

    @Put(':id')
    async update(
        @Param('id', new ParseIntPipe()) id,
        @Body() note: Note,
    ): Promise<any> {
        note.id = Number(id);
        return this.usersService.update(note);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id): Promise<any> {
        return this.usersService.delete(id);
    }
}
