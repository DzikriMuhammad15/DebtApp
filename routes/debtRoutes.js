const debtController = require("../controllers/debtController");
const express = require("express");
const router = express.Router();

// ! ROUTING
router.get("/", debtController.getDebtMain);
router.post("/createDebtRequest", debtController.createDebtRequest);
router.put("/verifyDebtRequest", debtController.verifyDebtRequest);
router.get("/getTransactionById/:id", debtController.getTransactionById);
router.post("/deleteTransaction", debtController.deleteTransaction);

module.exports = router;
