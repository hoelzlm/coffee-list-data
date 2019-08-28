module.exports = {
    email: String,
    password: String,
    created: { type: Date, default: Date.now },
    updated: Date,
    firstName: String,
    lastName: String,
}