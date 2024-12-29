const { reseller } = require("googleapis/build/src/apis/reseller");

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/google');
}

module.exports = isAuthenticated;