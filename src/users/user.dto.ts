export interface UsersResponse {
    response: UserDTO[];
}

export interface UserDTO {
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
}
