import expressAsyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.mjs';
import User from '../models/users.mjs';
import Message from '../models/message.mjs';

const allChats = expressAsyncHandler(async (req, res) => {
    try {
        const chats = await Message.find({chat : req.params.chatId})
        res.status(200).send(chats);
    }
    catch (err) {
        res.status(400).json({ message: "Invalid chat data" });
    }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

export { allChats, sendMessage };