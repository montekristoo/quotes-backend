import PostModel from "../models/Post.js";

export const create = async(req, res) => {
    try {
        const doc = new PostModel({
            text: req.body.text,
            tags: req.body.tags.split(","),
            author: req.body.author,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })
        const post = await doc.save();
        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on post creating."
        })
    }
}

export const update = async(req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId,
        }, {
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            author: req.body.author
        });
        res.json({
            message: "success"
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on post updating."
        })
    }
}

export const getAll = async(req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on get all posts."
        })
    }
}

export const getOne = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: {
                viewsCount: 1
            },
        }, {
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on get post by id."
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Post doesn't exist."
                })
            }
            res.json(doc);
        }).populate('user')
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error."
        });
    }
}

export const remove = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on deleting post."
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Post doesn't exist."
                })
            }
            res.json({
                success: true
            })
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error on get the posts",
        });
    }
}

export const likingLogic = async(req, res) => {
    try {
        const postId = req.params.id;
        const action = req.body.action;
        const userId = req.body.userId;
        // if (!action) return;
        if (action === 'like') {
            await PostModel.updateOne({
                _id: postId
            }, {
                $push: {
                    likesCount: userId
                }
            })
        }
        if (action === 'dislike') {
            await PostModel.updateOne({
                _id: postId
            }, {
                $pull: {
                    likesCount: userId
                }
            })
        }
        const post = await PostModel.find({
            _id: postId
        })

        let count = post[0].likesCount.length

        res.json({
            likes: count
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on like or dislike."
        })
    }
}

export const getCountLikes = async(req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.find({
            _id: postId,
        });
        let count = post[0].likesCount.length;

        res.json({
            likes: count,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on like or dislike.",
        });
    }
};

export const getPostsByUserId = async(req, res) => {
    try {
        const userId = req.params.id;
        const posts = await PostModel.find({
            user: userId,
        });
        console.log(posts);
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error on getting posts",
        });
    }
};