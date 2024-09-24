import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

const validateQueryParam =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req.query);

            if (!result.success) {
                const error = result.error.flatten().fieldErrors;
                const errorMessage = (Object.entries(error) as Record<string, any>).reduce(
                    (acc: string[], [key, value]: [string, string]) => {
                        acc.push(key)
                        return acc
                    },
                    [],
                );

                throw errorMessage;
            }
            req.query = result.data
        } catch (err) {
            (err as string[]).map((item) => {
                req.query[item] = undefined
            })
        } finally {
            next();
        }
    };
export default validateQueryParam;
