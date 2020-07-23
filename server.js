// Importing external pacakges - CommonJS
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { response } = require("express");

// Creating my Server
const app = express();

// Installing the body-parser middleware
// Allow us to read JSON from requests
app.use(bodyParser.json());

// Read in JSON FILE (mock database)
let products = [];

try {
  products = JSON.parse(fs.readFileSync("products.json")).products;
} catch (error) {
  console.log("No existing file.");
}

// Defining our HTTP Resource Methods
// API Endpoints
// Routes

// GET ALL PRODUCTS
// GET /api/products
app.get("/api/products", (request, response) => {
  response.send(products);
});

// GET A SPECIFIC PRODUCT BY ID
// GET /api/products/:id

// CREATE A NEW PRODUCT
// POST /api/products { id: 123, name: 'apples', price: 1.99 }
app.post("/api/products", (request, response) => {
  // Read the json body from the request
  const body = request.body;

  // Validate the json body to have required properties
  /* Required Properties:
    -id
    -name
    -price
  */
  if (!body.id || !body.name || !body.price) {
    response.send("Bad Request. Validation Error. Missing id, name, or price!");
    return;
  }

  // Add the new product to our existing products array
  products.push(body);

  // Commit the new products array to the database (json file)
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});

// UPDATE EXISTING PRODUCT BY ID
// PUT /api/products/:id { id: 123, name: 'apples', price: 4.99 }

// DELETE EXISTING PRODUCY BY ID
// DELETE /api/products/:id

// Starting my Server
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Grocery API Server Started!");
});
