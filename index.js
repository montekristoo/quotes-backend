import express from "express"
import cors from "cors"
import mongoose from 'mongoose'
import multer from "multer"
import {
    loginValidation,
    postCreateValidation,
    registerValidation
} from "./validations/validations.js";
import handleValidErrors from "./utils/handleValidErrors.js";
import {
    PostControler,
    UserControler
} from "./controlers/index.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB ok!"))
    .catch((e) => console.log("DB error!", e));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
});
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/uploads", express.static("uploads"));
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        });
    } catch (e) {
        console.log(e);
    }
});

app.use(express.json());

app.post(
    "/auth/register",
    registerValidation,
    handleValidErrors,
    UserControler.register
);
app.post(
    "/auth/login",
    loginValidation,
    handleValidErrors,
    UserControler.login
);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handleValidErrors,
    PostControler.create
);
app.post("/posts/like/:id", checkAuth, PostControler.likingLogic);
app.get("/auth/me", checkAuth, UserControler.getMe);
app.get("/posts", PostControler.getAll);
app.get("/posts/:id", PostControler.getOne);
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    handleValidErrors,
    PostControler.update
);
app.delete("/posts/:id", checkAuth, PostControler.remove);
app.get("/posts/like/:id", PostControler.getCountLikes);
app.get("/user/:id", UserControler.getOneUser);
app.get("/user/:id/posts", PostControler.getPostsByUserId);

app.listen(process.env.PORT || 3001, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("SERVER OK");
});