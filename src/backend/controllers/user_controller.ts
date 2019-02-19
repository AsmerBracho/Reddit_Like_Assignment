import * as express from "express";
import * as joi from "joi";
import { getUserRepository } from "../repositories/user_repository";

export function getUserController() {

    const userRepository = getUserRepository();
    const router = express.Router();

    const userDetailsSchemaForValidations = {
        email: joi.string().email(),
        password: joi.string()
    };

    /**
     * HTTP POST http://localhost:8080/api/v1/users/
     * Purpose: It Creates a new Use account 
     */
    router.post("/", (req, res) => {
        (async () => {
            try {
                const newUser = req.body;
                const result = await joi.validate(newUser, userDetailsSchemaForValidations);
                if (result.error) {
                    res.status(400).send({ msg: "Email or Password Invalid!" });
                } else {
                    // validates if the user already exists 
                    const email = req.body.email;
                    if (await userRepository.findOne({ email: email })) {
                        res.status(400).send({ msg: "User already registered" });
                    } else { // if it does not 
                        const user = await userRepository.save(newUser);
                        res.json(newUser).send();
                    }
                }
                // If an internal error occurs
            } catch {
                res.status(500).send();
            }
        })();
    });

    /**
     * HTTP GET http://localhost:8080/api/v1/users/:id
     * Purpose: Returns and user with all its activity (links and comments) 
     */
    router.get("/:id", (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const id = req.params.id;
                // include relations
                const user = await userRepository.findOne(id, { relations: ["link", "comment"] });
                if (user === undefined) {
                    res.status(404).send({ msg: "User not Found" });
                } else {
                    // return user with activity (links and comments)
                    res.json(user);
                }
            } catch {
                res.status(500).send();
            }
        })();
    });

    return router;
}