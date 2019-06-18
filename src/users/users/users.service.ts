import { Injectable, HttpService } from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { UsersResponse } from '../user.dto';

const apiKey =
    '8f914c7d6af1e2c255aad8796c24250ecfd48013f405779eb83e9611f3be0089986c3410c4e4fdf06148e';
const extUrl = 'https://api.vk.com/method';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private httpService: HttpService,
    ) {}

    getUser(id: number): Observable<AxiosResponse<UsersResponse>> {
        const url: string = `${extUrl}/users.get?user_ids=${id}&v=5.95&fields=photo_200_orig&access_token=${apiKey}`;
        return this.httpService.get(url);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async update(user: User): Promise<UpdateResult> {
        return await this.userRepository.update(user.id, user);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
