const express= require('express');
const {protect} = require("../middleware/authMiddleware");
const {sendMessage, allMessages} = require("../controllers/messageController");

const router = express.Router();

//sending message
router.route('/').post(protect, sendMessage);

//fetch message in a chat
router.route('/:chatId').get(protect, allMessages);

module.exports = router;