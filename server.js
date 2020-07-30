// Importing external pacakges - CommonJS
const express = require("express");
const bodyParser = require("body-parser");
const dataAccessLayer = require("./dataAccessLayer");
dataAccessLayer.connect();

// Creating my Server
const app = express();

// Installing the body-parser middleware
// Allow us to read JSON from requests
app.use(bodyParser.json());

// Defining our HTTP Resource Methods
// API Endpoints / Routes

// GET ALL PRODUCTS
// GET /api/products
app.get("/api/products", async (request, response) => {
  const products = await dataAccessLayer.findAll();

  response.send(products);
});

// GET A SPECIFIC PRODUCT BY ID
// GET /api/products/:id
app.get("/api/products/:id", (request, response) => {
  // Number() -> is a global function provided by JavaScript
  // For converting strings to numbers.
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    if (productId === p.id) {
      return true;
    }
  });

  /*
  product = undefined => false
  !undefined => !false => true
  */
  if (!product) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  response.send(product);
});

// CREATE A NEW PRODUCT
// POST /api/products { name: 'apples', price: 1.99, category: 'produce' }
app.post("/api/products", async (request, response) => {
  // Read the json body from the request
  const body = request.body;

  // Validate the json body to have required properties
  /* Required Properties:
    -name
    -price
    -category
  */
  if (!body.name || !body.price || !body.category) {
    response.send(
      "Bad Request. Validation Error. Missing name, price, or category!"
    );
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.send();
});

// UPDATE EXISTING PRODUCT BY ID
// PUT /api/products/:id { id: 123, name: 'apples', price: 4.99 }
app.put("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    return productId === p.id;
  });

  if (!product) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  const body = request.body;

  if (body.name) {
    product.name = body.name;
  }

  if (body.price) {
    product.price = body.price;
  }

  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});

// DELETE EXISTING PRODUCY BY ID
// DELETE /api/products/:id
app.delete("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const productIndex = products.findIndex((p) => {
    return productId === p.id;
  });

  if (productIndex === -1) {
    response.send(`Product with ID ${productId} not found!`);
    return;
  }

  products.splice(productIndex, 1);

  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
  response.send();
});

// Starting my Server
const port = process.env.PORT ? process.env.PORT : 3001;
app.listen(port, () => {
  console.log("Grocery API Server Started!");
});
