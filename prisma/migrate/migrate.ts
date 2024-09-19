import prisma from "@/src/utility/prisma"
import dataUnitMeasurement from "../dataset/measurement_units.json";
import dataCategories from "../dataset/categories.json"

export default async function main() {
    try {
        await prisma.measurement_units.createMany({
            data: dataUnitMeasurement
        })

        await prisma.category.createMany({
            data: dataCategories
        })
    } catch (error) {
        console.error(error)
    }
}