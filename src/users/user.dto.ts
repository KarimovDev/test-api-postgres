export interface UsersResponse {
    response: UserDTO[];
}

interface UserDTO {
    id: number;
    first_name: string;
    last_name: string;
    photo_200_orig: string;
}
