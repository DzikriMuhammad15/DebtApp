const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    idTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
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
        required: true,
        default: false
    },
    date: {
        type: Date,
        required: true
    }
})

const Payment = mongoose.model("payment", PaymentSchema);
module.exports = Payment;