
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import {User} from "./user";
import {Vote} from "./vote";
import {Comment} from "./comment";

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public title!: string;
    @Column()
    public url!: string;

    /* Create relationship between link and user
     * Since a link can be assigned only to an user, but and user can have many 
     * links, we will have a ManyToOne relationship (many Links to One User)
     */
    @ManyToOne(type => User, user=> user.link)
    @JoinColumn()
    user!: User;

    // Relationship Link to Vote
    @OneToMany(type=> Vote, vote=> vote.link)
    vote!: Vote[];

    //Relationship Link to Comment 
    @OneToMany(type=> Comment, comment=> comment.link)
    comment!: Comment[];
}
