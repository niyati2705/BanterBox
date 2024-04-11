const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

//accesing chat, creating chat
router.route("/").post(protect, accessChat);
router.route('/').get(protect,fetchChats);

//for creating group
router.route('/group').post(protect,createGroupChat);
//update group; rename group name
router.route('/rename').put(protect,renameGroup);
//add someone
router.route('/groupadd').put(protect,addToGroup);
//remove someone, leave group
router.route('/groupremove').put(protect,removeFromGroup);


module.exports = router;
