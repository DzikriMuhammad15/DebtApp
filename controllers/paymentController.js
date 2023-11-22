const Payment = require("../models/Payment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { error } = require("jquery");

const pemetaanKeNama = async function (idUser) {
    const hasil = await User.findOne({ _id: idUser });
    return `${hasil.firstName} ${hasil.lastName}`;
}
const checkVerification = function (bool) {
    if (bool) {
        return "verified";
    }
    else {
        return "not verified";
    }
}

// ! ERROR HANDLING
const handleErrors = (err) => {
    const errorObj = {
        amount: ""
    }
    if (err.message == "transaction validation failed: amount: Path `amount` is required.") {
        errorObj.amount = "Please enter amount of payment";
    }
    if (err.message == "payment validation failed: amount: Path `amount` is required.") {
        errorObj.amount = "Please enter amount of payment";
    }
    if (err.message == "Amount of payment is greater than remaining debt") {
        errorObj.amount = "Amount of payment is greater than remaining debt";
    }
    return errorObj;
}


// ! REALISASI
module.exports.getPaymentMain = async (req, res) => {
    // render
    // menampilkan : keseluruhan transaction yang belum lunas (masih ada remaining), payment yang masih requested

    // TODO ambil res.locals.user dulu untuk mendapatkan current user
    const currentUser = res.locals.user;
    try {
        // TODO ambil semua row di mana current user menjadi Piutang ( menampilkan request debt history) kemudian simpan dalam variable history
        const transaction = await Transaction.find({ idHutang: res.locals.user._id, lunas: false });
        const transactionResult = await Promise.all(transaction.map(async (el) => {
            return {
                _id: el._id,
                namaHutang: await pemetaanKeNama(el.idHutang),
                namaPiutang: await pemetaanKeNama(el.idPiutang),
                amount: el.amount,
                description: el.description,
                verified: checkVerification(el.verified),
                paid: 0,
                remaining: el.remaining
            };
        }));
        // TODO ambil semua row di mana current user menjadi hutang dengan verifiednya false(melakukan verify request debt) kemudian simpan dalam variable requestDebt
        const requestedPayment = await Payment.find({ idPiutang: res.locals.user._id, verified: false });
        const requestedPaymentResult = await Promise.all(requestedPayment.map(async (el) => {
            return {
                _id: el._id,
                namaHutang: await pemetaanKeNama(el.idHutang),
                namaPiutang: await pemetaanKeNama(el.idPiutang),
                amount: el.amount,
                description: el.description,
                verified: checkVerification(el.verified),
                date: el.date
            };
        }));

        // TODO render halaman debt dengan mengirimkan data history dan requestDebt
        res.render("Payment", { trans: transactionResult, requestedPayment: requestedPaymentResult });
        // res.status(200).json({ history, requestDebt });
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
}

module.exports.createPayment = async (req, res) => {
    try {
        // ambil dulu idTransaction, amount, descripton
        const { idTransaction, amount, description } = req.body;
        const transaction = await Transaction.findOne({ _id: idTransaction });
        // TODO check dulu apakah amountnya lebih besar dari remainingnya atau tidak
        if (amount > transaction.remaining) {
            throw new Error("Amount of payment is greater than remaining debt");
        }
        // lakukan create berdasarkan data yang dimiliki
        await Payment.create({ idTransaction: idTransaction, amount: amount, description: description, verified: false, date: new Date(), idHutang: transaction.idHutang, idPiutang: transaction.idPiutang });
        // kembalikan ok
        res.status(200).json({ ok: "ok" });
    }
    catch (err) {
        console.log(err.message);
        const error = handleErrors(err);
        res.status(400).json({ error: error });
    }
}

module.exports.verifyPayment = async (req, res) => {
    try {
        // idPayment dari req.body
        const { idPayment } = req.body;
        // cari payment yang bersangkutan
        const payment = await Payment.findOne({ _id: idPayment });
        // ambil idTransaction dari payment yang bersangkutan
        const idTransaction = payment.idTransaction;
        // push payment ke paid transaction yang bersangkutan
        await Transaction.findOneAndUpdate({ _id: idTransaction }, { $push: { paid: idPayment } });
        // kurangi remaining dari transaction
        const transaction = await Transaction.findOne({ _id: idTransaction });
        const hasil = parseInt(transaction.remaining) - parseInt(payment.amount)
        await Transaction.findOneAndUpdate({ _id: idTransaction }, { remaining: hasil });
        // ubah verified payment menjadi true
        await Payment.findOneAndUpdate({ _id: idPayment }, { verified: true });
        // kembalikan ok
        res.status(200).json({ ok: "ok" });
    }
    catch (err) {
        console.log(err);
    }
}