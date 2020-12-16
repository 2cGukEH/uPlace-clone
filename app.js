import express from "express"; //express 를 import, express실행결과를 app상수로 만듦. 
import morgan from "morgan";
import helmet from "helmet"
import cookieparser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

import "./passport";

const app = express();

const CokieStore = MongoStore(session);

//그리고 이곳에 middleware추가.

/* app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://archive.org");
    return next();
}); */
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieparser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new CokieStore({ mongooseConnection: mongoose.connection })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);


/* app.use((req, res, next) => {
    
})

app.use(function(req, res, next) {
    
}) */

//cookie parser는 cookie를 전달받은 후 사용할 수 있도록 만들어주는 미들웨어.(사용자 인증 같은 곳에서 쿠키를 검사할 때 사용해야하기 떄문)
//body parser는 사용자가 웹사이트로 전달하는 정보들을 검사하는 미들웨어 request 정보에서 form이나 json 형태로 된 body를 검사함
//helmet 미들웨어는 application을 더 안전하게 만들어 줌(보안)
//morgan 미들웨어는 application에서 발생하는 모든 일들을 logging 함.

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);



export default app;