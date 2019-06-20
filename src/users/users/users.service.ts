import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import { Note } from '../note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { UsersResponse, User, UserDTO } from '../user.dto';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from 'src/config.service';
import { Redis } from 'ioredis';
import { stringify } from 'query-string';

@Injectable()
export class UsersService implements OnModuleInit {
    client: Redis;

    constructor(
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
        private httpService: HttpService,
        private readonly redisService: RedisService,
        private readonly config: ConfigService,
    ) {}

    async onModuleInit() {
        this.client = await this.redisService.getClient();
    }

    getUser(idString: string): Observable<AxiosResponse<UsersResponse>> {
        const parsed = {
            user_ids: idString,
            v: '5.95',
            fields: 'photo_200_orig',
            access_token: this.config.get('API_KEY'),
        };
        const stringified = stringify(parsed);

        const url: string = `${this.config.get(
            'EXT_URL',
        )}/users.get?${stringified}`;
        return this.httpService.get(url);
    }

    getEmptyUser(): User {
        return {
            id: 0,
            dateAdd: new Date(0),
            firstName: '',
            lastName: '',
            image: '',
            note: '',
        };
    }

    async findAll(orderDirection: 'ASC' | 'DESC'): Promise<User[]> {
        const notes = await this.noteRepository.find({
            order: {
                dateAdd: orderDirection,
            },
        });
        const users: User[] = [];
        let usersString = '';
        const usersMap = new Map();

        for (const [i, el] of notes.entries()) {
            const redisUser = (await this.client.hgetall(
                el.id.toString(),
            )) as User;
            users[i] = this.getEmptyUser();
            users[i].id = el.id;
            users[i].note = el.note;
            users[i].dateAdd = el.dateAdd;
            if (redisUser.id) {
                users[i].firstName = redisUser.firstName;
                users[i].lastName = redisUser.lastName;
                users[i].image = redisUser.image;
            } else {
                usersString += el.id + ',';
                usersMap.set(el.id, i);
            }
        }

        if (usersString !== '') {
            const vkResponse = await this.getUser(usersString).toPromise();
            for (const el of vkResponse.data.response) {
                const i = usersMap.get(el.id);
                users[i].firstName = el.first_name;
                users[i].lastName = el.last_name;
                users[i].image = el.photo_200_orig;
                this.client.hmset(el.id.toString(), users[i]).then(() => {
                    this.client.expire(
                        el.id.toString(),
                        Number(this.config.get('EXPIRE_TIME')),
                    );
                });
            }
        }

        return users;
    }

    async create(note: Note): Promise<User> {
        note.dateAdd = new Date();
        const savedNote = await this.noteRepository.save(note);

        const redisUser = (await this.client.hgetall(
            savedNote.id.toString(),
        )) as User;

        const user: User = this.getEmptyUser();
        user.id = savedNote.id;
        user.note = savedNote.note;
        user.dateAdd = savedNote.dateAdd;
        if (redisUser.id) {
            user.firstName = redisUser.firstName;
            user.lastName = redisUser.lastName;
            user.image = redisUser.image;
        } else {
            const vkResponse = await this.getUser(
                savedNote.id.toString(),
            ).toPromise();
            const vkUser = vkResponse.data.response[0] as UserDTO;
            user.firstName = vkUser.first_name;
            user.lastName = vkUser.last_name;
            user.image = vkUser.photo_200_orig;
            this.client.hmset(vkUser.id.toString(), user).then(() => {
                this.client.expire(
                    vkUser.id.toString(),
                    Number(this.config.get('EXPIRE_TIME')),
                );
            });
        }

        return user;
    }

    async update(note: Note): Promise<UpdateResult> {
        return await this.noteRepository.update(note.id, note);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.noteRepository.delete(id);
    }
}
