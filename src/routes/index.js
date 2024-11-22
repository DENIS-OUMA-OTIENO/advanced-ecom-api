const productRoute = require("../routes/productRoute");
const authRoute = require("../routes/authRoute")

const mountRoutes = (app) => {
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/auth", authRoute)
};

module.exports = mountRoutes;
