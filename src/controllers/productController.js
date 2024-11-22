const Product = require("../models/product");
const factory = require("./handlersFactory");

exports.getProducts = factory.getAll(Product, "Products");

exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
