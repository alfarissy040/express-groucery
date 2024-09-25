import app from "@/src";
import request from "supertest";
import { describe, expect, it } from "vitest";

const idProduct = "66f2685cc846acc3446f2bb7";

describe("GET /products", () => {
    it("get all products: should 200 OK", async () => {
        const response = await request(app).get("/v1/products")
        expect(response.status).toBe(200);
    })
    it("find product by name: should 200 OK", async () => {
        const response = await request(app).get("/v1/products?search=apple")
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    })
    it("find product by name: should 404 OK", async () => {
        const response = await request(app).get("/v1/products?search=loremipsum tralala")
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            "status": 404,
            "message": "Product not found"
        });
    })
});

describe("GET /products/:id", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get(`/v1/products/${idProduct}`)
        expect(response.status).toBe(200);
    })
    it("should return 404 NOT FOUND", async () => {
        const response = await request(app).get("/v1/products/1")
        expect(response.status).toBe(404);
    })
})