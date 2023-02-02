import app from "index";
import supertest from "supertest";
import fruits from "../src/data/fruits";

const server = supertest(app);

describe("GET /fruits", () => {
  it("Should respond with status 200 and return fruits data", async () => {
    fruits.push({
      id: 1,
      name: "Banana",
      price: 200,
    });

    const result = await server.get("/fruits");

    expect(result.status).toBe(200);
    expect(result.body).toEqual([
      {
        id: 1,
        name: "Banana",
        price: 200,
      },
    ]);
  });
});

describe("GET /fruits/:id", () => {
  it("Should respond with status 404 when given fruit does not exist", async () => {
    const result = await server.get("/fruits/-1");

    expect(result.status).toBe(404);
  });

  it("Should respond with status 200 and return fruit data", async () => {
    fruits.push({
      id: 2,
      name: "Laranja",
      price: 500,
    });

    const result = await server.get("/fruits/1");

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      id: 1,
      name: "Banana",
      price: 200,
    });
  });
});

describe("POST /fruits", () => {
  it("Should respond with status 422 when body is invalid", async () => {
    const result = await server.post("/fruits").send({
      naame: "Banana",
    });

    expect(result.status).toBe(422);
  });

  it("Should respond with status 409 when given fruit already exists", async () => {
    const result = await server.post("/fruits").send({
      name: "Banana",
      price: 200,
    });

    expect(result.status).toBe(409);
  });

  it("Should respond with status 201 and create new fruit", async () => {
    const fruitsLength = fruits.length;

    const result = await server.post("/fruits").send({
      name: "Acerola",
      price: 400,
    });

    expect(result.status).toBe(201);
    expect(fruits.length).toBe(fruitsLength + 1);
  });
});
