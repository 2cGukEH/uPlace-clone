import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false
    }
);

const db = mongoose.connection;

const handleOpen = () => console.log(' ✅ DB에 연결됨: Connected to DB (mongodb/we-tube)');
const handleError = (error) => console.log(` ⛔️ DB 에러발생: Error on DB Connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);