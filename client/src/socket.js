import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.SERVER_URL ?? 'http://localhost:3000'

const socket = io(SERVER_URL, {
    autoConnect: false
})

export default socket;
