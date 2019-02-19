import * as express from "express";
import jwt from "jsonwebtoken";

// Middleware function used to log request URLs
export function loggerMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    console.log(req.url);
    next();
}

// Middleware function used for JWT token validation
export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // Read token signature from environment variables
    const AUTH_SECRET = process.env.AUTH_SECRET;
    // Read token from request headers
    const token = req.headers["x-auth-token"];
    // Client error if no token found in request headers
    if (typeof token !== "string") {
        res.status(400).send({ msg: "Please login and provide a Token (header request, must contain the Token)" });
    } else {
        // Server error is environment variable is not set
        if (AUTH_SECRET === undefined) {
            res.status(500).send({ msg: "Enviorement AUTH_SECRET no set" });
        } else {
            try {
                // Check that the token is valid
                const obj = jwt.verify(token, AUTH_SECRET) as any;
                // Add the user ID to the HTTP request object so we can access it from the NEXT request handler
                (req as any).userId = obj.id;
                // Invoke NEXT request handler
                next();
            } catch(err) {
                // Unauthorized if token cannot be verified
                res.status(401).send({ msg: "Invalid Token" });
            }
        }
    }
}