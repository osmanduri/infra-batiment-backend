const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, data) => {
            if(err) {
                res.status(403).send("Token is not valid");
            }
            else{
                req.user = data;
                next();
            }

        })
    }else{
        return res.status(401).send('You are not authenticated !');
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            return res.status(403).json("You are not authorized")
        }
    })

}

module.exports = { verifyToken, verifyTokenAndAuthorization };