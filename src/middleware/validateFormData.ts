import { unlink } from "node:fs";
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

const validateFormData =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        const file = req.file as Express.Multer.File;
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                const error = result.error.flatten().fieldErrors;
                const errorMessage = Object.entries(error).reduce(
                    (acc, [key, value]) => {
                        return {
                            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
                            ...acc,
                            [key]: value?.join(", "),
                        };
                    },
                    {},
                );

                throw errorMessage;
            }
            next();
        } catch (err) {
            unlink(file.path, (err) => {
                if (err) console.error("Failed to delete file:", err);
            })
            return res.status(400).json({ error: err });
        }
    };
export default validateFormData;
