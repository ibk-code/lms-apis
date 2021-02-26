"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _controller = require("./controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var approvalRouter = _express["default"].Router();

approvalRouter.post("/approveCredit", _controller.approveCredit);
approvalRouter.post("/updateDownPayment", _controller.updateDownPayment);
var _default = approvalRouter;
exports["default"] = _default;