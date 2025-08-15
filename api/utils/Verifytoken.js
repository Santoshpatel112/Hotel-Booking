import jwt from "jsonwebtoken";

export const Verifytoken = (req, res, next) => {
    const token = req.cookies.access_token;
    
    if (!token) {
        return res.status(401).json({
            message: "User Not Authenticated"
        });
    }

    jwt.verify(token, process.env.Secret, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Token is not valid"
            });
        }
        
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    Verifytoken(req, res,next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    });
};



export const verifyAdmin = (req, res, next) => {
    Verifytoken(req, res,next, () => {
        if (req.user.isAdmin) {
            next(); // User is an admin, proceed to the next handler
        } else {
            // User is not an admin, send a 403 Forbidden error
            return res.status(403).json({
                message: "You are not an administrator"
            });
        }
    });
};
