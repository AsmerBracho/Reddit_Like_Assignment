
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import {User} from "./user";
import {Link} from "./link";


@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public feedback!: boolean;

    // Relationship Vote to Link (Many votes to one Link)
    @ManyToOne( type => Link, link=> link.vote)
    @JoinColumn()
    link!: Link;

    // Relationship Vote to User 
    @ManyToOne(type=> User, user=> user.vote)
    @JoinColumn()
    user!: User; 

    
}