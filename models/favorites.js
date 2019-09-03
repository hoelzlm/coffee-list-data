module.exports = {
    created: { type: Date, default: Date.now },
    updated: Date,
    name: String,
    members: { type: [Object] },
}