
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import {Link} from "./link"
import {User} from "./user"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public text!: string;

    // Relation Comment to Link 
    @ManyToOne(type => Link, link=> link.comment)
    @JoinColumn()
    link!: Link;

    // Relation Comment to User
    @ManyToOne(type => User, user=> user.link)
    @JoinColumn()
    user!: User; 

}