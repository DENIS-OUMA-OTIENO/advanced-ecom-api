const Cart = require('../models/cart')
const factory = require('./handlersFactory')

exports.getCart = factory.getOne(Cart)

exports.createCart = factory.createOne(Cart)

exports.updateCart = factory.updateOne(Cart)

exports.deleteCart = factory.deleteOne(Cart)