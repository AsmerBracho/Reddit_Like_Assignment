
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Link } from "./link";
import {Vote} from "./vote";
import {Comment} from "./comment";

// Define the entity columns 
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public email!: string;
    @Column()
    public password!: string;

    //Relationships

    @OneToMany(type=> Link, link=> link.user)
    link!: Link[]; 

    @OneToMany(type=> Vote, vote=> vote.user)
    vote!: Vote[];

    @OneToMany(type=> Comment, comment=> comment.user)
    comment!: Comment[];

    
    
}