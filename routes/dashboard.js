var express = require('express');
var router = express.Router();
const dashboardController = require("../controllers/dashboardController.js")



/* GET users listing. */
router.get('/', dashboardController.renderDashboard);



module.exports = router;
