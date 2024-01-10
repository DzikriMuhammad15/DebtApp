const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.authCheck = (req, res, next) => {
    // TODO ambil token dari cookies
    const token = req.cookies.jwt;
    // TODO cek keberadaan token
    if (token) {
        // TODO  ada jika: 
        // TODO cek verifikasi token
        jwt.verify(token, "9cdef459a8f71de4e4016adb9d8b1179e8092221b7154a26234512dae02025fc", async (err, decodedToken) => {
            if (!err) {
                // TODO jika terferifikasi : 
                // TODO  ubah res.loacls.user kemudian next
                const user = await User.findOne({ _id: decodedToken.id });
                res.locals.user = user;
                next();
            }
            else {
                // TODO jika tidak terverifikasi
                // TODO ubah res.locals.user menjadi null kemudian next
                res.locals.user = null;
                next();
            }
        })
    }
    else {
        // TODO jika tidak ada : 
        // TODO ubah res.locals.user menjadi null kemudian next
        res.locals.user = null;
        next();
    }
}


module.exports.protectRoute = (req, res, next) => {
    // TODO ambil token dari cookies
    const token = req.cookies.jwt;
    // TODO cek jwtnya ada ato enggak
    if (jwt) {
        // TODO kalo ada, cek apakah terverifikasi
        jwt.verify(token, "9cdef459a8f71de4e4016adb9d8b1179e8092221b7154a26234512dae02025fc", (err, decodedToken) => {
            if (!err) {
                // TODO kalo terverifikasi, cek apakah ada di database atau tidak
                const id = decodedToken.id;
                const user = User.findOne({ _id: id });
                if (user) {
                    // TODO kalo ada, next
                    next();
                }
                else {
                    // TODo kalo tidak balikin ke login
                    res.redirect("/auth")
                }
            } else {
                // TODO kalo tidak terverifikasi, balikin ke login
                res.redirect("/auth")
            }
        })

    }
    else {
        // TODO kalo tidak ada, balikin ke login
        res.redirect("/auth")
    }
}
