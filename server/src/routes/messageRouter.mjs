import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
import { allChats, sendMessage } from '../controllers/messageController.mjs'

const router = express.Router();

router.route('/:chatId').get(protect, allChats);
router.route("/").post(protect, sendMessage);

export default router;