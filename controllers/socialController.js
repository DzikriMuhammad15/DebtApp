const User = require("../models/User");
const Transaction = require("../models/Transaction")
const mongoose = require("mongoose");



// ! REALISASI 
module.exports.getSocialMain = async (req, res) => {
    // TODO ambil dulu data temen dari orang yang bersangkutan
    try {
        // TODO ambil dulu data dari current user
        const currentUser = res.locals.user;
        // TODO kemudian akses atribut friendnya dan simpan sebagai array
        const currentUserFriend = currentUser.friend;
        // TODO kemudian kitim datanya ke res.render
        let friends = await Promise.all(currentUserFriend.map(async (element) => {
            let friend = await User.findOne({ _id: element });
            return friend;
        }));
        // todo ambil dulu hutang current user dan piutang current user
        const hutangCurrentUser = await Transaction.find({ idHutang: currentUser._id });
        const piutangCurrentUser = await Transaction.find({ idPiutang: currentUser._id });
        console.log({ hutangCurrentUser, piutangCurrentUser });
        res.render("socialMain", { friend: friends, hutangCurrentUser: hutangCurrentUser, piutangCurrentUser: piutangCurrentUser, mongoose });

    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }

}

module.exports.addFriend = async (req, res) => {
    try {
        const currentUser = res.locals.user;
        const currentUserRequest = currentUser.friendRequest;
        let friendRequests = await Promise.all(currentUserRequest.map(async (element) => {
            let friendRequest = await User.findOne({ _id: element });
            return friendRequest;
        }));
        res.render("addFriend", { friendRequest: friendRequests, result: null });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
}

module.exports.putFriendRequest = async (req, res) => {
    // TODO ambil dulu id pengguna yang mau direquest
    const { email } = req.body;
    // TODO ambil id dari request (id yang mau direquest friend)
    const idCurrent = res.locals.user._id;
    // TODO findone and update dengan filter id pengguna target dan menambahkan current id pada array
    try {
        const hasil = await User.findOneAndUpdate({ email: email }, { $push: { friendRequest: idCurrent } }, { new: true });
        console.log(hasil);
        res.json({ ok: "ok" })
    }
    catch (err) {
        console.log(err);
        res.status(404);
    }
}


module.exports.acceptRequest = async (req, res) => {
    try {
        // TODO ambil dulu current user
        const currentUser = res.locals.user;
        // TODO ambil id dari user yang mau di acc
        const { id } = req.body;
        // TODO hilangkan current user dari user target dalam array friendRequestnya
        const result = await User.findOneAndUpdate({ _id: currentUser._id }, { $pull: { friendRequest: id } }, { new: true });
        console.log(id);
        console.log(result);
        // TODO tambahkan current user sebagai friend dari user taget
        const result1 = await User.findOneAndUpdate({ _id: id }, { $push: { friend: currentUser._id } });
        // TODO tambahkan user target sebagai friend dari current user
        const result2 = await User.findOneAndUpdate({ _id: currentUser._id }, { $push: { friend: id } });
        // TODO redirect ke /addFriend
        console.log("END");
        res.json({ ok: "ok" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
}

module.exports.searchEmail = async (req, res) => {
    // TODO ambil data email dari form
    const email = req.params.email;
    // TODO ambil currentUser dari res.locals
    const currentUser = res.locals.user;
    // TODO lakukan pencarian user yang sesuai emailnya
    try {
        const result = await User.findOne({ email: email });
        const currentUser = res.locals.user;
        const currentUserRequest = currentUser.friendRequest;
        let friendRequests = await Promise.all(currentUserRequest.map(async (element) => {
            let friendRequest = await User.findOne({ _id: element });
            return friendRequest;
        }));
        res.render("addFriend", { friendRequest: friendRequests, result: result });
    }
    catch (err) {
        // TODO kalo gaada, redirect lagi ke /addfriend
        // gaketemu emailnya
        res.redirect("/social/addFriend");
    }
}