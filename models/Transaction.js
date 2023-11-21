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
    paid: {
        type: Boolean,
        required: true
    }
})

const Transaction = mongoose.model("transaction", TransactionSchema);
module.exports = Transaction;