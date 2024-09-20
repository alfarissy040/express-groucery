import prisma from "@/src/utility/prisma"
import dataCategories from "../dataset/categories.json"
import dataUnitMeasurement from "../dataset/measurement_units.json";
import dataProducts from "../dataset/product.json"

async function main() {
    try {
        await prisma.measurement_units.createMany({
            data: dataUnitMeasurement
        })

        await prisma.category.createMany({
            data: dataCategories
        })

        const categories = await prisma.category.findMany({})

        dataProducts.map(async (item) => {
            await prisma.products.create({
                data: {
                    id_category: [...item.id_category[0] === "1" ? categories[0].id : categories[1].id],
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

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })