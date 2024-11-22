const User = require("../models/user")
const factory = require("./handlersFactory")

exports.getUsers = factory.getAll(User)

exports.getUser = factory.getOne(User)

exports.createUser = factory.createOne(User)

exports.deleteUser = factory.deleteOne(User)

exports.updateUser = async(req, res, next) => {
    
}