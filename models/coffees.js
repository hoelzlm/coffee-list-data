module.exports = {
    uid: Object,
    added_by: String,
    date: Date,
    paid: {
        type: Boolean,
        default: false
    },
    paymentId: Object,
    amount: Number,
    typeId: Object,
    deleted: {
        type: Boolean,
        default: false
    }
}