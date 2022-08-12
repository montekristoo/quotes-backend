import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import UserModel from "../models/User.js"

export const register = async(req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
        const user = await doc.save();
        const token = jwt.sign({
            _id: user.id,
        }, "secret", {
            expiresIn: "30d",
        });
        const {
            passwordHash,
            ...userData
        } = user._doc;
        res.json({
            userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error on registration."
        })
    }
}

export const login = async(req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
        });
        if (!user) {
            res.status(404).json({
                message: "The user doesn't exist",
            });
            return;
        }

        const isValidPass = await bcrypt.compare(
            req.body.password, user.passwordHash
        );
        if (!isValidPass) {
            res.status(400).json({
                message: "The password or the login is incorrect."
            });
            return;
        }
        const token = jwt.sign({
            _id: user._id,
        }, "secret", {
            expiresIn: "30d"
        });

        const {
            passwordHash,
            ...userData
        } = user._doc;
        res.json({
            userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: "Eroare."
        })
    }
}

export const getMe = async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            });
        }
        const {
            passwordHash,
            ...userData
        } = user._doc;
        res.json({
            userData,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on get user.",
        });
    }
};

export const getOneUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            });
        }
        const {
            passwordHash,
            ...data
        } = user._doc;
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on get user.",
        });
    }
};