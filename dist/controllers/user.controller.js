"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../lib/jwt");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const signUpSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const signInSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        signUpSchema.parse({ name, email, password });
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 * 1000,
        });
        res.status(201).json({ message: 'User created successfully', token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            next(error);
        }
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        signInSchema.parse({ email, password });
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            const token = (0, jwt_1.generateToken)(user.id);
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 * 1000,
            });
            res.json({ message: 'Login successful', token });
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            next(error);
        }
    }
});
exports.signIn = signIn;
