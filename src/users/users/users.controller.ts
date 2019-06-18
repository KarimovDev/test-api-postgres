import { Controller, Get, Res, Query, HttpStatus } from '@nestjs/common';
import { User } from '../user.entity';
import { UsersService } from '../users/users.service';
import { Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ValidateObjectId } from '../user.pipes';
import { UsersResponse } from '../user.dto';
import { take, retry } from 'rxjs/operators';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('vk')
    vk(@Res() res, @Query('id', new ValidateObjectId()) id): void {
        this.usersService
            .getUser(Number(id))
            .pipe(
                retry(3),
                take(1),
            )
            .subscribe(
                result => {
                    const data = result.data as UsersResponse;
                    return res.status(HttpStatus.OK).json(data);
                },
                error =>
                    res.status(HttpStatus.GATEWAY_TIMEOUT).json({
                        error: error,
                    }),
            );
    }

    @Get()
    async index(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post('create')
    async create(@Body() user: User): Promise<any> {
        return this.usersService.create(user);
    }

    @Put(':id/update')
    async update(
        @Param('id', new ValidateObjectId()) id,
        @Body() user: User,
    ): Promise<any> {
        user.id = Number(id);
        return this.usersService.update(user);
    }

    @Delete(':id/delete')
    async delete(@Param('id', new ValidateObjectId()) id): Promise<any> {
        return this.usersService.delete(id);
    }
}
