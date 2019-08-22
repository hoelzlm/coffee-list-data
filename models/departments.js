module.exports = {
    uid: Object,
    created: Date,
    updated: Date,
    name: String,
    location: { type: [Number], default: [0, 0] },
    members: { type: [Object] },
    coffeeTypes: { type: [Object] }
}