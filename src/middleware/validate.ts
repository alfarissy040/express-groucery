import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

const validate =
	(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
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
			return res.status(400).json({ error: err });
		}
	};
export default validate;
