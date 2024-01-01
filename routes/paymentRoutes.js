const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// ! ROUTING
router.get("/", paymentController.getPaymentMain);
router.post("/createPayment", paymentController.createPayment);
router.put("/verifyPayment", paymentController.verifyPayment);
router.post("/getPaymentByArrayOfId", paymentController.getPaymentByArrayOfId);


module.exports = router;
