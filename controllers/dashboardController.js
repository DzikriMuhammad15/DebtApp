const Transaction = require("../models/Transaction");
const User = require("../models/User");

const idToEmail = async (id) => {
    try {
        const hasil = await User.findOne({ _id: id });
        return hasil ? hasil.email : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports.renderDashboard = async (req, res) => {
    try {
        const currentUser = res.locals.user;

        // Ambil seluruh data transaksi di mana current user menjadi piutang
        const piutang = await Transaction.find({ idPiutang: currentUser._id });

        // Ambil seluruh data transaksi di mana current user menjadi utang
        const hutang = await Transaction.find({ idHutang: currentUser._id });

        // Sisipkan emailPiutang ke setiap objek dalam array piutang
        const piutang1 = await Promise.all(piutang.map(async (item) => {
            return {
                ...item.toObject(),
                emailPiutang: await idToEmail(item.idPiutang),
                emailHutang: await idToEmail(item.idHutang)
            };
        }));

        // Sisipkan emailHutang ke setiap objek dalam array hutang
        const hutang1 = await Promise.all(hutang.map(async (item) => {
            return {
                ...item.toObject(),
                emailHutang: await idToEmail(item.idHutang),
                emailPiutang: await idToEmail(item.idPiutang)
            };
        }));

        console.log('Data Hutang:', hutang1);
        console.log('Data Piutang:', piutang1);

        res.render("Dashboard", { piutang1, hutang1 });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
