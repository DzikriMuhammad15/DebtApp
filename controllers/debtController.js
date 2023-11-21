const Transaction = require("../models/Transaction");
const User = require("../models/User");

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

const checkPaid = function (bool) {
    if (bool) {
        return "paid";
    }
    else {
        return "not paid";
    }
}

// ! ERROR HANDLING
const handleErrors = (err) => {
    const errorObj = {
        email: "",
        amount: "",
        description: ""
    }
    if (err.message == "Anda tidak berteman dengan pengguna tersebut") {
        errorObj.email = "Anda tidak berteman dengan pengguna tersebut";
    }
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errorObj[properties.path] = properties.message;
        })
    }
    if (err.message == "Cannot read properties of null (reading '_id')") {
        errorObj.email = "Anda tidak berteman dengan pengguna tersebut";
    }
    if (err.message == "transaction validation failed: amount: Path `amount` is required.") {
        errorObj.amount = "Please enter amount of debt";
    }
    return errorObj;
}

// ! REALISASI
module.exports.getDebtMain = async (req, res) => {
    // TODO ambil res.locals.user dulu untuk mendapatkan current user
    const currentUser = res.locals.user;
    try {
        // TODO ambil semua row di mana current user menjadi Piutang ( menampilkan request debt history) kemudian simpan dalam variable history
        const history = await Transaction.find({ idPiutang: currentUser._id });
        const historyResult = await Promise.all(history.map(async (el) => {
            return {
                _id: el._id,
                namaHutang: await pemetaanKeNama(el.idHutang),
                namaPiutang: await pemetaanKeNama(el.idPiutang),
                amount: el.amount,
                description: el.description,
                verified: checkVerification(el.verified),
                paid: checkPaid(el.paid)
            };
        }));
        // TODO ambil semua row di mana current user menjadi hutang dengan verifiednya false(melakukan verify request debt) kemudian simpan dalam variable requestDebt
        const requestDebt = await Transaction.find({ idHutang: currentUser._id, verified: false });
        const requestDebtResult = await Promise.all(requestDebt.map(async (el) => {
            return {
                _id: el._id,
                namaHutang: await pemetaanKeNama(el.idHutang),
                namaPiutang: await pemetaanKeNama(el.idPiutang),
                amount: el.amount,
                description: el.description,
                verified: checkVerification(el.verified),
                paid: checkPaid(el.paid)
            };
        }));

        // TODO render halaman debt dengan mengirimkan data history dan requestDebt
        res.render("Debt", { history: historyResult, requestDebt: requestDebtResult });
        // res.status(200).json({ history, requestDebt });
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
}

const emailToId = async function (email) {
    const result = await User.findOne({ email: email });
    return result._id;
}

const checkIdFriend = async function (id, res) {
    // TODO ambil current user
    const currentUser = res.locals.user;
    const array = currentUser.friend;
    // TODO cek apakah id berada dalam array friend
    // TODO jika ada kembalikan true
    // TODO jika tidak kembalikan false
    return array.includes(id);
}


module.exports.createDebtRequest = async (req, res) => {
    try {
        // TODO ambil dulu data2 dari req.body
        const { email, amount, description } = req.body;
        const idHutang = await emailToId(email);
        if (! await checkIdFriend(idHutang, res)) {
            throw new Error("Anda tidak berteman dengan pengguna tersebut");
        }
        // TODO ambil res.locals.user untuk mendapatkan current user
        const currentUser = res.locals.user;
        // TODO create record di transaction dengan currentUser sebagai piutang
        const result = await Transaction.create({ idHutang: idHutang, idPiutang: currentUser._id, amount: amount, description: description, verified: false, paid: false });
        // TODO kembalikan pesan berhasil jika berhasil membuatnya
        res.status(200).json({ result: result });
    }
    catch (err) {
        console.log(err.message);
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }
}

module.exports.verifyDebtRequest = async (req, res) => {
    try {
        // TODO ambil idTransaksi yang ingin diverifikasi
        const { idTransaksi } = req.body;
        // TODO update verifiednya menjadi true
        await Transaction.findOneAndUpdate({ _id: idTransaksi }, { verified: true });
        // TODO kembalikan pesan berhasil jika berhasil
        res.status(200).json({ ok: "ok" });
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
}