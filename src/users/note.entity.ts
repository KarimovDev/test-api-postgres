import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity()
export class Note {
    @IsNumber()
    @IsNotEmpty()
    @PrimaryColumn()
    id: number;

    @IsString()
    @IsNotEmpty()
    @Column()
    note: string;

    @Column()
    dateAdd: Date;
}
