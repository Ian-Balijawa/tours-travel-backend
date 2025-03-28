import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity( 'users' )
export class User extends BaseEntity {
    @Column( { unique: true } )
    email: string;

    @Column()
    password: string;

    @Column( 'simple-array' )
    roles: string[];
}
