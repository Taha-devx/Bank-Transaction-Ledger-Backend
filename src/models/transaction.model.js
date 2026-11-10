const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    formAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a from account"],
        index: true,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a to account"],
        index: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required to create a transaction"],
        min: [0, "Amount must be a positive number"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency Key is required to create a transaction"],
        index: true,
        unique: true
    }
},{
    timestamps: true
})

transactionSchema.index({formAccount: 1, toAccount: 1, idempotencyKey: 1})

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel