"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
var checkJwt = function (req, res, next) {
    var token = req.headers['auth'];
    var jwtPayload;
    try {
        jwtPayload = jwt.verify(token, config_1.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (e) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    var userId = jwtPayload.userId, username = jwtPayload.username;
    var newToken = jwt.sign({ userId: userId, username: username }, config_1.default.jwtSecret, { expiresIn: '2h' });
    res.setHeader('token', newToken);
    next();
};
exports.default = checkJwt;
//# sourceMappingURL=jwt.js.map