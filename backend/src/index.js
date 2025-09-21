import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import http from "http";
import { initSocket } from "./utils/io.js";

dotenv.config({
    path: './.env'
});



connectDB()
.then(() => {
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = initSocket(server);

    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});