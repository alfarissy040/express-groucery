import { z } from "zod";

export const productSchema = z.object({
    id_unit: z.string().min(1, {
        message: "Unit is Required!",
    }),
    id_category: z.string().array().min(1, {
        message: "Category is Required!",
    }),
    name: z.string().min(1, {
        message: "Name is Required!",
    }),
    price: z.string().refine((v) => /^\d+$/.test(v), {
        message: "Price is Required and only number is allowed!",
    }),
    stock: z.string().refine((v) => /^\d+$/.test(v), {
        message: "Stock is Required and only number is allowed!",
    }),
    description: z.string().min(1, {
        message: "Description is Required!",
    }),
    version: z.number().default(1).optional(),
    image_url: z.string().optional(),
})

export const schemaQueryparam = z.object({
    search: z.string().optional().nullable(),
    page: z.string().optional().nullable().refine((v) => !v || /^\d+$/.test(v), {
        message: "Page must be a number",
    }),
    orderby: z.string().default("name").optional().nullable().refine((v) => !v || ["name", "price", "stock"].includes(v), {
        message: "Orderby must be one of name, price, or stock",
    }),
    sort: z.string().default("asc").optional().nullable().refine((v) => !v || ["asc", "desc"].includes(v), {
        message: "Sort must be one of asc or desc",
    }),
})

export const updateProductSchema = z.object({
    id_unit: z.string().optional(),
    id_category: z.string().array().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    image_url: z.string().optional(),
    price: z.string().refine((v) => /^\d+$/.test(v), {
        message: "Price is Required and only number is allowed!",
    }).transform((v) => Number.parseInt(v)).optional(),
    stock: z.string().refine((v) => /^\d+$/.test(v), {
        message: "Stock is Required and only number is allowed!",
    }).transform((v) => Number.parseInt(v)).optional(),
    version: z.string().refine((v) => /^\d+$/.test(v), {
        message: "version is Required and only number is allowed!",
    }).transform((v) => Number.parseInt(v)),
})

export type TProduct = z.infer<typeof productSchema>
export type TupdateProductSchema = z.infer<typeof updateProductSchema>
export type TProductQueryParam = z.infer<typeof schemaQueryparam>