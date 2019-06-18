import { Controller, Get } from '@nestjs/common';
import { User } from '../user.entity';
import { UsersService } from '../users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    index(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
