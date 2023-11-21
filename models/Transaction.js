const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    idHutang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    idPiutang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    paid: [{ type: mongoose.Schema.Types.ObjectId, ref: "paymenr" }],
    remaining: {
        type: Number,
        required: true
    },
    lunas: {
        type: Boolean,
        default: false
    }
})

const Transaction = mongoose.model("transaction", TransactionSchema);
module.exports = Transaction;