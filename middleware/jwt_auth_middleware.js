global.jwt = require('jsonwebtoken');

global.authorize = (req, res, next) => {
    console.log(req.headers);

    const authHeader = req.headers.authorization;

    if(typeof authHeader !== 'undefined'){
        jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, results) => {
            if(err){
                return res.sendStatus(403);
            }else{
                // console.log(results);
                // res.json({results});
                next();
            }
        });
    }else{
        return res.sendStatus(401);
    }
}