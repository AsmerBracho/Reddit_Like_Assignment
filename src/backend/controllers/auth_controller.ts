import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";

export function getAuthController() {

    const AUTH_SECRET = process.env.AUTH_SECRET;
    const userRepository = getUserRepository();
    const router = express.Router();

    // create schema for validation 
    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };

    // HTTP POST http://localhost:8080/api/v1/auth/login/
    router.post("/login", (req, res) => {
        (async () => {
            // get the data from the body
            const userDetails = req.body;
            // validate data whit joi 
            const result = joi.validate(userDetails, userDetailsSchema);
            // id result trows an error 
            if (result.error) {
                res.status(400).send({ msg: "Invalid Input" });
            } else {
                const match = await userRepository.findOne(userDetails);
                if (match === undefined) {
                    res.status(401).send({ msg: "User not found, couldn't get a token" });
                } else {
                    if (AUTH_SECRET === undefined) {
                        1
                        res.status(500).send({ msg: "Enviorement AUTH_SECRET no set" });
                    } else {
                        const token = jwt.sign({ id: match.id }, AUTH_SECRET);
                        res.json({ token: token }).send();
                    }
                }
            }
        })();
    });

    return router;
}