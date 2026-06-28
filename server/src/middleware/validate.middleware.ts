import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

// takes a schema and returns an express middleware
export const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })) as { body?: any; query?: any; params?: any };

            // Overwrite the raw request data with zods perfectly clean data! 
            if (parsedData.body) req.body = parsedData.body;
            if (parsedData.query) Object.defineProperty(req, "query", { value: parsedData.query, writable: true });
            if (parsedData.params) Object.defineProperty(req, "params", { value: parsedData.params, writable: true });
            // if it passes, move on to the controller!
            return next()
        } catch (error: any) {
            console.error("Validation error:", error);
            if (error instanceof ZodError || error?.name === "ZodError") {
                // Automatically format zod errors into a clean array for the frontend 

                const formattedErrors = error.errors.map((err: any) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                return res.status(400).json({
                    message: "Validation failed",
                    errors: formattedErrors
                })
            }
            return res.status(500).json({ 
                message: "Internal server error during validation",
                error: error?.message || String(error)
            });
        }
    }
}