import { Request, Response, NextFunction } from "express";
import {  ZodType } from "zod";
import {  ZodError } from "zod/v3";

// takes a schema and returns an express middleware
export const validate = (schema:ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // parse the body,query, and params against the schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params

            })
            // if it passes, move on to the controller!
            return next()
        } catch (error) {
            if (error instanceof ZodError) {
                // Automatically format zod errors into a clean array for the frontend 

                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                return res.status(400).json({
                    message: "Validation failed",
                    errors: formattedErrors
                })
            }
            return res.status(500).json({ message: "Internal server error during validation" });
        }
    }
}