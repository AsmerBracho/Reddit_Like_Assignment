import * as joi from "joi";
import * as express from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { getCommentRepository } from "../repositories/comment_repository";
import { getLinkRepository } from "../repositories/link_repository";

export function getCommentController() {

    // Create respository so we can perform database operations
    const commentRepository = getCommentRepository();
    const linkRepository = getLinkRepository();

    // Create router instance so we can declare enpoints
    const router = express.Router();

    /**
     * HTTP POST http://localhost:8080/api/v1/comments
     * POST a new Comment 
     */
    router.post("/", authMiddleware, (req, res) => {
        (async () => {
            try {
                // Get the current user logged In
                const userId = (req as any).userId;
                const linkId = req.body.link.id;
                // get data
                const newComment = {
                    // ID is automatically generated and autoincremented in the database
                    text: req.body.text,
                    link: { id: linkId },
                    user: { id: userId }
                };

                const result = joi.validate(req.body.text, joi.string());
                const result2 = joi.validate(req.body.link.id, joi.number().greater(0));

                if (result.error || result2.error) {
                    res.status(400).send({ msg: "Input Invalid! Please Verify it" });
                } else {
                    // check if comment exists
                    const c = await linkRepository.findOne({
                        where: { id: linkId }
                    });
                    if (!c) {
                        res.status(404).send({ msg: "Link not found, verify Input" });
                    } else {
                        // add new comment
                        const comment = await commentRepository.save(newComment);
                        res.json(comment);
                    }
                }
                // catch an error if an internal error occurs
            } catch (err) {
                console.log(err);
                res.status(500).send({ msg: "Internal Server Error" });
            }
        })();
    });

    /**
     * HTTP DELETE http://localhost:8080/api/v1/comments/:id
     * DELETE a comment 
     */
    router.delete("/:id", authMiddleware, (req, res) => {
        (async () => {
            try {
                // get the current user logged in
                const userId = (req as any).userId;
                // get ID
                const id = req.params.id;

                // check if the user is the owner of the comment, for that we need to feach the comment 
                const c2 = await commentRepository.findOne({
                    where: {
                        id: id
                    },
                    relations: ["user"]
                });
                // c2 could be undefined (not found)
                if (!c2) {
                    res.status(404).send({ msg: "Comment not Found" });
                } else {
                    if (c2.user.id != userId) {
                        res.status(400).send({ msg: "This Comment is not listed as your. You can NOT Delete it" });
                    } else {
                        const comment = await commentRepository.delete(id);
                        res.json({ ok: "Comment Deleted Succesfully" });
                    }
                }
            } catch (err) {
                console.log(err);
                res.status(500).send({ msg: "Internal Server Error" })
            }
        })();
    });

    /**
     * HTTP PATCH http://localhost:8080/api/v1/comments/:id
     * Update a comment 
     */
    router.patch("/:id", authMiddleware, (req, res) => {
        (async () => {
            try {
                // get the current user logged in
                const userId = (req as any).userId;
                // get ID
                const id = req.params.id;

                // check if the user is the owner of the comment, for that we need to feach the comment 
                const c2 = await commentRepository.findOne({
                    where: {
                        id: id
                    },
                    relations: ["user"]
                });
                // c2 could be undefined (not found)
                if (!c2) {
                    res.status(404).send({ msg: "Comment not Found" });
                } else {
                    if (c2.user.id != userId) {
                        res.status(400).send({ msg: "This Comment is not listed as your. You can NOT Update it" });
                    } else {
                        // get data 
                        const data = req.body;
                        // Then we get the key of that object
                        const key = Object.keys(data)[0];
                        // retrieve value
                        const value = data[key];
                        // assign the value to the new one
                        (c2 as any)[key] = value;
                        const newC = await commentRepository.save(c2);
                        res.json(newC);
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(500).send("Internal Server Error!");
            }
        })();
    });

    return router;
}
