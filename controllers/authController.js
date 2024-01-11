const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

// ! MEMBUAT JWT
const maxAge = 7 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, "9cdef459a8f71de4e4016adb9d8b1179e8092221b7154a26234512dae02025fc", { expiresIn: maxAge });
}


// ! ERROR HANDILNG
const handleErrors = (err) => {
    const errorObj = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    }
    console.log(err);
    if (err.code === 11000) {
        errorObj.email = 'that email is already registered';
        return errorObj;
    }
    if (err.message === "incorrect password") {
        errorObj.password = "incorrect password";
    }
    if (err.message === "email not found") {
        errorObj.email = "email not found";
    }
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errorObj[properties.path] = properties.message;
        })
    }

    return errorObj;
}




// ! REALISASI

module.exports.homeGet = (req, res) => {
    res.render("loginRegister");
}

module.exports.signUpGet = (req, res) => {
    res.render("signup");
}

module.exports.signUpPost = async (req, res) => {
    // TODO mengambil data dari request
    const { firstName, lastName, email, password } = req.body;
    // TODO memasukkannya ke dalam db (try catch)
    try {
        // TODO kalau berhasil, bikin jwt, masukin cookies, kembalikan object user sebagai penanda keberhasilan
        const user = await User.create({ firstName, lastName, email, password });
        const token = createToken(user._id);
        const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
        res.cookie("jwt", token, cookieConfig);
        res.status(201).json({ user: user });

    }
    catch (err) {
        // TODO kalau gagal, error handling, dan kirim errr
        console.log(err);
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }


}

module.exports.loginGet = (req, res) => {
    res.render("login");
}

module.exports.loginPost = async (req, res) => {
    // TODO ambil dulu masukan email dan password
    const { email, password } = req.body;
    try {
        // TODO panggil fungsi login pada model User
        const user = await User.login(email, password);
        // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
        const token = createToken(user._id);
        const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
        res.cookie("jwt", token, cookieConfig);
        res.status(201).json({ user: user });

    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        const errorObj = handleErrors(err);
        res.status(400).json({ error: errorObj });
    }
}

module.exports.logoutGet = (req, res) => {
    // TODO hapus dulu cookienya
    res.clearCookie("jwt");
    // TODO redirect ke home
    res.redirect("/");
}

module.exports.changePassword = async (req, res) => {
    // todo ambil dulu newPassword dan newPasswordConfirmation dari request
    const { id, newPassword, newPasswordConfirmation } = req.body;
    // todo cek dulu apakah newPassword itu ada atau tidak
    if (newPassword.length > 0) {
        // todo cek dulu apakah password lebih dari atau sama dengan 6 karakter
        if (newPassword.length >= 6) {
            // todo ambil cek apakah confirmation sama dengan newPassword
            if (newPassword == newPasswordConfirmation) {
                try {
                    // todo kalau sama, edit data pada model user untuk mengganti passwordnya (dengan melakukan hash terlebih dahulu)
                    const salt = await bcrypt.genSalt();
                    const Updatepassword = await bcrypt.hash(newPassword, salt);
                    const hasil = await User.findOneAndUpdate({ _id: id }, { password: Updatepassword });
                    // todo kalau berhasil kembalikan json success sebagai pendanda berhasil
                    res.status(200).json({ success: "ok" });
                }
                catch (err) {
                    // todo kalau gagal, catch errornya dan masukkan ke dalam error handler
                    const errorObj = handleErrors(err);
                    res.status(400).json({ error: errorObj });
                }
            }
            else {
                // todo kalau tidak sama, kembalikan pesan kesalahan dalam atribut password bahwa password doesn't match
                res.status(400).json({ error: { password: "password doesn't match" } });
            }
        }
        else {
            res.status(400).json({ error: { password: "minimum password length is 6 characters" } });
        }
    }
    else {
        res.status(400).json({ error: { password: "please enter new password" } });
    }
}