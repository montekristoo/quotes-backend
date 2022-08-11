import jwt from "jsonwebtoken"

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "")
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret');
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message: "Error."
            })
        }
    } else {
        return res.status(403).json({
            message: "Token doesn't exist"
        })
    }
}