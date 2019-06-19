import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Note {
    @PrimaryColumn()
    id: number;

    @Column()
    note: string;
}
