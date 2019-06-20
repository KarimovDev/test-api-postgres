export interface UsersResponseVkDto {
    error: any;
    response: UserVkDto[];
}

export interface UserVkDto {
    id: number;
    first_name: string;
    last_name: string;
    photo_200_orig: string;
}

export interface User {
    id: number;
    dateAdd: Date;
    firstName: string;
    lastName: string;
    image: string;
    note: string;
    error?: any;
}

export interface UsersDto {
    users: User[];
    error?: any;
}
