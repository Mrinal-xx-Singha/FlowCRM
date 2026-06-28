"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
// takes a schema and returns an express middleware
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsedData = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            }));
            // Overwrite the raw request data with zods perfectly clean data! 
            if (parsedData.body)
                req.body = parsedData.body;
            if (parsedData.query)
                Object.defineProperty(req, "query", { value: parsedData.query, writable: true });
            if (parsedData.params)
                Object.defineProperty(req, "params", { value: parsedData.params, writable: true });
            // if it passes, move on to the controller!
            return next();
        }
        catch (error) {
            console.error("Validation error:", error);
            if (error instanceof zod_1.ZodError || error?.name === "ZodError") {
                // Automatically format zod errors into a clean array for the frontend 
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                return res.status(400).json({
                    message: "Validation failed",
                    errors: formattedErrors
                });
            }
            return res.status(500).json({
                message: "Internal server error during validation",
                error: error?.message || String(error)
            });
        }
    };
};
exports.validate = validate;
