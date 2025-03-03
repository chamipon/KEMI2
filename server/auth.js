import jwt from "jsonwebtoken";

class Auth{
    //Ideally, we would only generate an access token once someone has logged in. 
    static generateAccessToken(username) {
        return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    }

    //Middleware function to verify authorization header
    static authenticate(req,res,next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    
        if (token == null) {
            return res.sendStatus(401)
        }
    
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    }
}


export default Auth;