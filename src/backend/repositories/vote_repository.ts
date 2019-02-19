import { getConnection } from "typeorm";
import { Vote } from "../entities/vote";

export function getVoteRepository() {
    const connection = getConnection();
    const voteRepository = connection.getRepository(Vote);
    return voteRepository;
}
