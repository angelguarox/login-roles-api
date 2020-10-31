"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = require("../controller/AuthController");
var jwt_1 = require("../middlewares/jwt");
var role_1 = require("../middlewares/role");
var router = express_1.Router();
router.post('/login', AuthController_1.default.login);
router.post('/changepassword', [jwt_1.default, role_1.default(['admin'])], AuthController_1.default.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map