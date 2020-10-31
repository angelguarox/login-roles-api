"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controller/UserController");
var jwt_1 = require("../middlewares/jwt");
var role_1 = require("../middlewares/role");
var router = express_1.Router();
router.get('/', [jwt_1.default, role_1.default(['admin'])], UserController_1.default.getAll);
router.get('/:id', [jwt_1.default, role_1.default(['admin'])], UserController_1.default.getById);
router.post('/', [jwt_1.default, role_1.default(['admin'])], UserController_1.default.newUser);
router.patch('/:id', [jwt_1.default, role_1.default(['admin'])], UserController_1.default.editUser);
router.delete('/:id', [jwt_1.default, role_1.default(['admin'])], UserController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map