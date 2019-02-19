// We will need to create a connection 
import { createConnection } from "typeorm";

// import our entities since the will be needed to be pass as arguments for the conection 
import { User } from "./backend/entities/user";
import { Link } from "./backend/entities/link";
import { Comment } from "./backend/entities/comment";
import { Vote } from "./backend/entities/vote";

export async function createDbConnection() {

    // Read the database settings from the environment vairables
    const DATABASE_HOST = process.env.DATABASE_HOST;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    const DATABASE_USER = process.env.DATABASE_USER;
    const DATABASE_DB = process.env.DATABASE_DB;

    // Display the settings in the console so we can see if something is wrong
    console.log(
        `
            host: ${DATABASE_HOST}
            password: ${DATABASE_PASSWORD}
            user: ${DATABASE_USER}
            db: ${DATABASE_DB}
        `
    );

    // Create and Open database connection
    await createConnection({
        type: "postgres",
        host: DATABASE_HOST,
        port: 5432,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,

        // add here every entity you have declared in the folder src/backend/entities 
        entities: [
            User,
            Vote,
            Comment,
            Link
            
        ],
        // This setting will automatically create database tables in the database server
        synchronize: true
    });

}