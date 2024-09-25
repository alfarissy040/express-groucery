import { unlink } from "node:fs";
import type { NextFunction, Request, Response } from "express";
import type { z, ZodSchema } from "zod";

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

            req.body = result.data as z.infer<typeof schema>;
            next();
        } catch (err) {
            if (file) {
                unlink(file.path, (err) => {
                    if (err) console.error("Failed to delete file:", err);
                })
            }
            return res.status(400).json({ error: err });
        }
    };
export default validateFormData;
