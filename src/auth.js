const jwt = require('jsonwebtoken');
const JWT_KEY = 'cwbdibvnvnuvwqtecfvxvwyfrytbg';
const cookie = require('cookie-parser')

const protectRoute = (req, res, next) => {
    if (req.cookies.login) {
        let isVerified = jwt.verify(req.cookies.login, JWT_KEY);
        if (isVerified) {
            res.signedup=isVerified.id;
            next();
        }
        else {
            res.render('login');
        }
    } else {
        res.render('login');
    }
};

module.exports = protectRoute;






