import validateQueryParam from "@/src/middleware/validateQueryParam"
import type { dbSort } from "@/src/types"
import { getPageQuery } from "@/src/utility/db"
import prisma from "@/src/utility/prisma"
import { type Request, type Response, Router } from "express"
import { z } from "zod"

const schemaQueryparam = z.object({
    search: z.string().optional().nullable(),
    page: z
        .string()
        .optional()
        .nullable()
        .refine((v) => !v || /^\d+$/.test(v), {
            message: "Page must be a number",
        }),
    orderby: z
        .string()
        .default("name")
        .optional()
        .nullable()
        .refine((v) => !v || ["name", "price", "stock"].includes(v), {
            message: "Orderby must be one of name, price, or stock",
        }),
    sort: z
        .string()
        .default("asc")
        .optional()
        .nullable()
        .refine((v) => !v || ["asc", "desc"].includes(v), {
            message: "Sort must be one of asc or desc",
        }),
})

const productRouter = Router()

productRouter.get("/", validateQueryParam(schemaQueryparam), async (req: Request, res: Response) => {
    const searchParam = req.query.search as string ?? "";
    const orderByParam = req.query.orderby as string ?? "name";
    const sortParam = (req.query.sort as string ?? "asc") as dbSort;
    const page: number = getPageQuery(req.query.page as string);
    const limit = 25;
    const offset = (page - 1) * limit;

    try {
        const products = await prisma.products.findMany({
            where: {
                name: {
                    startsWith: searchParam,
                    mode: "insensitive"
                },
            },
            take: limit,
            skip: offset,
            orderBy: {
                [orderByParam]: sortParam
            },
        })
        const totalProducts = await prisma.products.count({
            where: {
                name: {
                    startsWith: searchParam,
                    mode: "insensitive"
                },
            },
        })

        return res.json({
            data: [...products],
            page: page,
            totalPages: Math.ceil(totalProducts / limit),
            total: totalProducts,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Something went wrong!" })
    }
})

export default productRouter