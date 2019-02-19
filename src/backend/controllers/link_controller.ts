import * as joi from "joi";
import * as express from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { getLinkRepository } from "../repositories/link_repository"
import { getVoteRepository } from "../repositories/vote_repository"
import { Link } from "../entities/link";
import { Repository } from "typeorm";

export function getLinkController() {

    // Create respository so we can perform database operations
    const linkRepository = getLinkRepository();
    const voteRepository = getVoteRepository();

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // Declare Joi Schema so we can validate links
    const linkSchemaForPostValidations = {
        id: joi.number().greater(0),
        title: joi.string(),
        url: joi.string(),
        userId: joi.number().greater(0),
    };

    /**
     * HTTP GET http://localhost:8080/api/v1/links
     * Get a list with all links 
     */
    router.get("/", (req, res) => {
        try {
            (async () => {
                const links = await linkRepository.find();
                res.json(links);
            })();
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Internal Server Error" });
        }
    });

    /**
     * // HTTP GET http://localhost:8080/api/v1/links/:id
     * Get the link specified and its comments  
     */
    router.get("/:id", (req: express.Request, res: express.Response) => {
        try {
            (async () => {
                const id = req.params.id;
                // include relations
                const link = await linkRepository.findOne(id, { relations: ["comment"] });
                res.json(link);
            })();
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Internal Server Error" });
        }
    });

    /**
     * HTTP POST http://localhost:8080/api/v1/links
     * POST a new Link
     * Private EndPoint
     */
    router.post("/", authMiddleware, (req, res) => {
        (async () => {
            try {
                // Get the current user logged In
                const userId = (req as any).userId;
                //get link from body
                const newLink = {
                    // ID is automatically generated and autoincremented in the database
                    title: req.body.title,
                    url: req.body.url,
                    user: { id: userId }
                };
                const result = joi.validate(req.body, linkSchemaForPostValidations);
                if (result.error) {
                    res.status(400).send({ msg: "Input Invalid! Please Verify it" });
                } else {
                    /** If an user try to post a link without loggin in the class midleware 
                     *  will rise the errors denying the access 
                     * 
                     *  Errors comes from the auth_middleware.ts (line 25 - 41) 
                     */
                    const link = await linkRepository.save(newLink);
                    res.json(link);
                }
                // catch an error if an internal error ocurs
            } catch (err) {
                console.log(err);
                res.status(500).send({ msg: "Internal Server Error" });
            }
        })();
    });

    /**
     * HTTP DELETE http://localhost:8080/api/v1/links
     * DELETE a Link 
     */
    router.delete("/:id", authMiddleware, (req, res) => {
        try {
            (async () => {
                const userId = (req as any).userId;
                const id = req.params.id;

                // check if the user is the owner of the link, for that we need to feach the link 
                const l = await linkRepository.findOne({
                    where: {
                        id: id
                    },
                    relations: ["user"]
                });
                // l could be undefined, which means link does not exist 
                if (!l) {
                    res.status(400).send({ msg: "Link does not exist" });
                } else {
                    // check if user does not own the link
                    if (l.user.id != userId) {
                        res.status(400).send({ msg: "This Link is not listed as your. You can NOT Delete it" });
                        // else, all ok then => delete the link 
                    } else {
                        const link = await linkRepository.delete(id);
                        res.json({ ok: "Link Deleted Succesfully" });
                    }
                }
            })();
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Internal Server Error" });
        }
    });

    //******************VOTE CONTROLLERS*******************/
    /**
     * Since Vote is assigned to a link and related with an user we will generate the controllers HERE 
     * 
     */

    /**
    * HTTP POST http://localhost:8080/api/v1/links/:id/upvote
    * It Upvotes link
    * 
    * Private end point
    */
    router.post("/:id/upvote", authMiddleware, (req, res) => {
        (async () => {
            try {
                // Get the current user logged In
                const userId = (req as any).userId;
                const linkId = req.params.id;
                const data = {
                    // ID is automatically generated and autoincremented in the database
                    feedback: true,
                    user: { id: userId },
                    link: { id: linkId }
                };
                // try to find a single vote which take the current user and ID 
                // if vote is found it means the user already has vote for the link 
                if (await voteRepository.findOne({ user: { id: userId }, link: { id: linkId } })) {
                    res.status(400).send({ msg: "You have already vote for this link" });
                    // else, vote
                } else {
                    const vote = await voteRepository.save(data);
                    res.json(vote);
                }
                // catch an error if an internal error ocurs
            } catch (err) {
                console.log(err);
                res.status(500).send({ msg: "Internal Server Error" });
            }
        })();
    });

    /**
     * HTTP POST http://localhost:8080/api/v1/links/:id/upvote
     * It Upvotes link
     * 
     * Private end point
     */
    router.post("/:id/downvote", authMiddleware, (req, res) => {
        (async () => {
            try {
                // Get the current user logged In
                const userId = (req as any).userId;
                const linkId = req.params.id;
                const data = {
                    // ID is automatically generated and autoincremented in the database
                    feedback: false,
                    user: { id: userId },
                    link: { id: linkId }

                };
                if (await voteRepository.findOne({ user: { id: userId }, link: { id: linkId } })) {
                    res.status(400).send({ msg: "You have already vote for this link" });
                } else {
                    const vote = await voteRepository.save(data);
                    res.json(vote);
                }
                // catch an error if an internal error ocurs
            } catch (err) {
                console.log(err);
                res.status(500).send({ msg: "Internal Server Error" });
            }
        })();
    });
    return router;
}
//----------------------------------HANDLER FOR TESTS---------------------------------------
/**
 * By using Handler we can have a better performance and organization of your programme 
 * this code could be rewriten to make it more reusable by applying the use of handlers 
 * however for practice purpose we will live the code as it is and implement a separate handler for 
 * testing purpuses so we can see as well a different approach 
 */

// create a function to achive the isolation and being able to test with fake parameters
export function getHandlers(linkRepo: Repository<Link>) {

    /**
     * we need to create a complete isolated function. In order to do that we will pass the 
     * request, the response and the Link (data) as parameters
     */
    const createLinkHandler = (req: express.Request, res: express.Response, theLink: Link) => {

        (async () => {
            try {
                const newLink = await linkRepo.save(theLink);
                res.json(newLink);
            } catch (err) {
                console.log(err);
                res.status(500).send();
            }
        })();
    };

    return { createLinkHandler: createLinkHandler };

}