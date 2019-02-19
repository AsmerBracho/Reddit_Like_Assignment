import express from "express";
import bodyParser from "body-parser";
import { createDbConnection } from "./db";
import { getLinkController } from "./backend/controllers/link_controller";
import { getUserController } from "./backend/controllers/user_controller";
import { getAuthController } from "./backend/controllers/auth_controller";
import { getCommentController } from "./backend/controllers/comment_controller";

export async function getApp() {

    // Create db connection
    await createDbConnection();

    // Create app (by calling express instance)
    const app = express();

    // In order to been able send JSONs, the following Server config is needed 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Declare main path for the application (HOME PAGE)
    app.get("/api/v1/", (req, res) => {
        res.send("This is the home page!");
    });

    // Declare controllers
    const linkController = getLinkController();
    const usersController = getUserController();
    const authController = getAuthController();
    const commentControler = getCommentController();
    
    app.get("/", (req, res) => {
        res.send("Welcome to the API server!");
    });

    // Use the controller in accordance with its path
    app.use("/api/v1/links", linkController);
    app.use("/api/v1/users", usersController);
    app.use("/api/v1/auth", authController);
    app.use("/api/v1/comments", commentControler);

    return app;
};