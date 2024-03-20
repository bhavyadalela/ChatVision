import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.mjs";
import User from "../models/users.mjs";

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: {$elemMatch: { $eq: userId }}},
            { users: {$elemMatch: { $eq: req.user._id }}}
        ],
    }).populate("users", "-password")
        .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name, email" 
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        }
        else {
            var charData = {
                chatName: "sender",
                isGroupChat: false,
                users: [userId, req.user._id],
            };
            try {
                const createdChat = await Chat.create(charData);

                const FullChat = await Chat.findById(createdChat._id).populate("users", "-password")

                res.status(200).send(FullChat);
            }
            catch (err) {
                res.status(400).json({ message: "Invalid chat data" });
            }
        }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
    try {

        const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id }} })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (chats) => {
            const fullChat = await User.populate(chats, {
                path: "latestMessage.sender",
                select: "name, email"
            });

            res.status(200).send(fullChat);
        });
    }
    catch (err) {
        res.status(400).json({ message: "Invalid chat data" });
    }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.users) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ message: "Please add more than one user" });
    }

    users.push(req.user._id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        });

        const fullChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        
        res.status(200).send(groupChat);
    }
    catch (err) {
        res.status(400).json({ message: "Invalid chat data" });
    }
});

const renameGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.chatName) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        req.body.chatId,
        { chatName: req.body.chatName },
        { new: true }
    );

    if (updatedChat) {
        res.status(200).send(updatedChat);
    }
    else {
        res.status(400).json({ message: "Invalid chat data" });
    }
    
});

const groupAdd = expressAsyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.users) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    var users = req.body.users;
    var chat = await Chat.findById(req.body.chatId);
    if (chat) {
        chat.users = chat.users.concat(users);
        chat.save();
        res.status(200).send(chat);
    }
    else {
        res.status(400).json({ message: "Invalid chat data" });
    }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    var chat = await Chat.findById(req.body.chatId);
    if (chat) {
        chat.users = chat.users.filter((user) => user != req.body.userId);
        chat.save();
        res.status(200).send(chat);
    }
    else {
        res.status(400).json({ message: "Invalid chat data" });
    }
});

export { accessChat, fetchChat, createGroupChat, renameGroupChat, groupAdd, removeFromGroup };