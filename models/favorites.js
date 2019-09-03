module.exports = {
    uid: Object,
    created: { type: Date, default: Date.now },
    updated: Date,
    name: String,
    members: { type: [Object] },
}