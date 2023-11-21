const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");

// ! ROUTING
router.get("/", socialController.getSocialMain); // done
router.get("/addFriend", socialController.addFriend) // done
router.put("/requestFriend", socialController.putFriendRequest); // done
router.put("/acceptRequest", socialController.acceptRequest); // done
router.get("/addFriend/searchEmail/:email", socialController.searchEmail); // done


module.exports = router;
