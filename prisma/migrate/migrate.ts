import prisma from "@/src/utility/prisma"
import dataCategories from "../dataset/categories.json"
import dataUnitMeasurement from "../dataset/measurement_units.json";
import dataProducts from "../dataset/product.json"
import { includes } from "lodash";

async function seeder() {
    try {
        await prisma.measurement_units.createMany({
            data: dataUnitMeasurement
        })

        await prisma.category.createMany({
            data: dataCategories
        })

        const categories = await prisma.category.findMany({})

        dataProducts.map(async (item) => {
            const id_category = categories.reduce((acc: string[], value) => {
                if (includes(item.id_category, value.name)) {
                    acc.push(value.id)
                }
                return acc
            }, [])
            await prisma.products.create({
                data: {
                    id_category: id_category,
                    id_unit: item.id_unit,
                    name: item.name,
                    price: item.price,
                    stock: item.stock,
                    description: item.description,
                    image_url: item.image_url,
                    version: item.version,
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
}

async function migrate() {
    try {
        await prisma.category.deleteMany({})
        await prisma.measurement_units.deleteMany({})
        await prisma.products.deleteMany({})
        await prisma.user.deleteMany({})
    } catch (error) {
        console.error(error)
    }
}

async function main() {
    try {
        await migrate()
        await seeder()
        await prisma.$disconnect()
    } catch (error) {
        console.error(error)
    } finally {
        process.exit(1)
    }
}

main()