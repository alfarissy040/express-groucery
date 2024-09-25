import { unlink } from "node:fs"
import validateFormData from "@/src/middleware/validateFormData"
import validateQueryParam from "@/src/middleware/validateQueryParam"
import { type TProduct, type TupdateProductSchema, productSchema, schemaQueryparam, updateProductSchema } from "@/src/schema/productSchema"
import type { TCommonError, dbSort } from "@/src/types"
import { baseUrl, imageStorage } from "@/src/utility"
import { getPageQuery } from "@/src/utility/db"
import prisma from "@/src/utility/prisma"
import { Prisma } from "@prisma/client"
import { type Request, type Response, Router } from "express"
import { isEqual } from "lodash"
import multer from "multer"
import NodeCache from "node-cache"

const productRouter = Router()
const cache = new NodeCache({ checkperiod: 60 * 5 });
// GET /
// get all products
productRouter.get("/", validateQueryParam(schemaQueryparam), async (req: Request, res: Response) => {
    const searchParam = req.query.search as string ?? "";
    const orderByParam = req.query.orderby as string ?? "name";
    const sortParam = (req.query.sort as string ?? "asc") as dbSort;
    const page: number = getPageQuery(req.query.page as string);
    const limit = 25;
    const offset = (page - 1) * limit;
    const cacheKey = `/products?${searchParam}-${orderByParam}-${sortParam}-${page}`

    try {
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey))
        }
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
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                image_url: true,
                version: true,
                created_at: true,
                // relasionship table
                categories: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                unit: {
                    select: {
                        code: true,
                        name: true,
                    },
                }
            }
        })
        if (products.length === 0) throw ({ status: 404, message: "Product not found" })
        const totalProducts = await prisma.products.count({
            where: {
                name: {
                    startsWith: searchParam,
                    mode: "insensitive"
                },
            },
        })

        products.map((item, i) => {
            products[i].image_url = `${baseUrl}/public/images/${item?.image_url}`
        })
        const response = {
            data: [...products],
            page: page,
            totalPages: Math.ceil(totalProducts / limit),
            total: totalProducts,
        }

        cache.set(cacheKey, response)
        return res.json(response)
    } catch (err) {
        console.error(err)
        const error = err as TCommonError
        if (!error.status) {
            return res.status(500).json({ message: "Something went wrong!" })
        }

        return res.status(error.status).json(error)
    }
})

// GET /:id
// get single product
productRouter.get("/:id", async (req: Request, res: Response) => {
    const idParam = req.params.id as string
    const cacheKey = `/products/${idParam}`
    try {
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey))
        }
        const product = await prisma.products.findUnique({
            where: { id: idParam },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                image_url: true,
                version: true,
                created_at: true,
                // relasionship table
                categories: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                unit: {
                    select: {
                        code: true,
                        name: true,
                    },
                }
            }
        })
        if (!product) throw ({ status: 404, message: "Product not found" });
        const response = { data: { ...product, image_url: `${baseUrl}/public/images/${product?.image_url}` } }

        cache.set(cacheKey, response)
        return res.json(response)
    } catch (err) {
        const error = err as TCommonError
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (err.code === 'P2023') {
                return res.status(404).json({ message: "Product not found!" })
            }
        }
        if (!error.status) {
            return res.status(500).json({ message: "Something went wrong!" })
        }

        return res.status(error.status).json(error)
    }
})

// POST /create
// create new product
productRouter.post("/create", multer({ storage: imageStorage }).single("image"), validateFormData(productSchema), async (req: Request, res: Response) => {
    const body = req.body as TProduct
    const file = req.file as Express.Multer.File
    try {
        const product = await prisma.products.create({
            data: {
                id_category: body.id_category,
                id_unit: body.id_unit,
                name: body.name,
                description: body.description,
                price: Number.parseInt(body.price),
                stock: Number.parseInt(body.stock),
                image_url: file.filename,
            }
        })
        cache.keys().map((item) => {
            if (item.startsWith('/products?')) cache.del(item)
        })
        return res.json({ data: product })
    } catch (err) {
        console.error(err)
        const error = err as TCommonError

        unlink(file?.path, (err) => console.error('Failed to delete file:', err));
        if (!error.status) {
            return res.status(500).json({ message: "Something went wrong!" })
        }
        return res.status(error.status).json(error)
    }
})

// PUT /:id
// update Product
productRouter.put("/:id", multer({ storage: imageStorage }).single("image"), validateFormData(updateProductSchema), async (req: Request, res: Response) => {
    const body = req.body as TupdateProductSchema
    const idParam = req.params.id
    const file = req.file as Express.Multer.File
    const cacheKey = `/products/${idParam}`
    try {
        if (file) {
            body.image_url = file.filename
        }
        const product = await prisma.products.findFirst({
            where: { id: idParam },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                image_url: true,
                version: true
            }
        });

        if (!product) throw ({ status: 404, message: "Product not found" });
        if (!isEqual(product.version, body.version)) throw ({ status: 409, errors: "VersionConflict", message: `Product version not match!, Current version is ${product.version}`, data: product });

        const updateProduct = await prisma.products.update({
            where: { id: idParam },
            data: {
                ...body,
                version: {
                    increment: 1
                }
            }
        })

        const response = { data: { ...updateProduct, image_url: `${baseUrl}/public/images/${updateProduct?.image_url}` } }
        cache.keys().map((item) => {
            if (item.startsWith('/products?')) cache.del(item)
        })
        cache.set(cacheKey, response)
        return res.json(response)
    } catch (err) {
        console.error(err)
        const error = err as TCommonError
        if (!error.status) return res.status(500).json({ message: "Something went wrong!" });

        return res.status(error.status).json(error)
    }
})

export default productRouter