const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    status: String,
}, {
    collection: 'users',
    minimize: false,
    versionKey: false,
});

module.exports = Schema