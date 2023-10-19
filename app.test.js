// tests for the app module
const app = require('./app');
const request = require('supertest');
const items = require('./fakeDb');

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(function () {
    items.push(popsicle);
});

afterEach(function () {
    items.length = 0;
});

describe("GET /items", function () {
    test("Gets a list of items", async function () {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([popsicle]);
    });
});

describe("GET /items/:name", function () {
    test("Gets a single item", async function () {
        const resp = await request(app).get(`/items/${popsicle.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(popsicle);
    });
    test("Responds with 404 if can't find item", async function () {
        const resp = await request(app).get(`/items/tupac`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("POST /items", function () {
    test("Creates a new item", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "pizza",
                price: 10
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            ADDED: { name: "pizza", price: 10 }
        });
    });
});

describe("PATCH /items/:name", function () {
    test("Updates a single item", async function () {
        const resp = await request(app)
            .patch(`/items/${popsicle.name}`)
            .send({
                name: "pizza",
                price: 10
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            UPDATED: { name: "pizza", price: 10 }
        });
    });
    test("Responds with 404 if can't find item", async function () {
        const resp = await request(app).patch(`/items/bob-odenkirk`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", function () {
    test("Deletes a single a item", async function () {
        const resp = await request(app)
            .delete(`/items/${popsicle.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "DELETED" });
    });
});

describe("Error handler", function () {
    test("404 handler", async function () {
        const resp = await request(app).get(`/no-such-path`);
        expect(resp.statusCode).toBe(404);
    });
});



