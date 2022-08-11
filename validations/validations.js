import {
    body
} from "express-validator"

export const loginValidation = [
    body("email", "Incorrect format of mail.").isEmail(),
    body("password", "The password must have at least 5 characters").isLength({
        min: 5
    })
];

export const registerValidation = [
    body("email", "Incorrect format of mail").isEmail(),
    body("password", "The password must have at least 5 characters").isLength({
        min: 5
    }),
    body("fullName", "Enter your name.").isLength({
        min: 3,
    }),
    body("avatarUrl", "Invalid address of photo").optional().isURL()
];

export const postCreateValidation = [
    body("text", 'Content of post.').isLength({
        min: 5,
    }).isString(),
    body("tags", 'Incorrect format of tags').optional().isString(),
    body("imageUrl", 'Invalid URL adress of photo').optional().isString(),
    body("author", "Enter an valid name of author").optional().isString()
]