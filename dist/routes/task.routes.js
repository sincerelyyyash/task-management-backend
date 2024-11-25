"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.use((req, res, next) => {
    (0, authMiddleware_1.verifyJWT)(req, res, next);
});
router.post('/', task_controller_1.createTask);
router.get('/', task_controller_1.getTasks);
router.put('/:id', task_controller_1.updateTask);
router.delete('/:id', task_controller_1.deleteTask);
router.get('/:id/history', task_controller_1.getTaskHistory);
exports.default = router;
