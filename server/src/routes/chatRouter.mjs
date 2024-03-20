import express from 'express';
import { accessChat, fetchChat, createGroupChat, renameGroupChat, groupAdd, removeFromGroup } from '../controllers/chatController.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChat);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroupChat);
router.route('/groupadd').put(protect, groupAdd);
router.route('/remove').put(protect, removeFromGroup);

export default router;