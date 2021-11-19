"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const endpoints_config_1 = __importDefault(require("./endpoints.config"));
const express_1 = __importDefault(require("express"));
const reminders_1 = __importDefault(require("./routes/reminders"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = require("mongoose");
const admin = __importStar(require("firebase-admin"));
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json');
const config_1 = __importDefault(require("./utils/config"));
const app = (0, express_1.default)();
const server = require('http').createServer(app);
const options = {
    cors: {
        credentials: true,
        origin: [config_1.default.frontend_url]
    }
};
const io = require('socket.io')(server, options);
const PORT = 8000;
let counter = 0;
io.on("connection", (socket) => {
    console.log(`socket number ${counter++} connected: ${socket.id}`);
    socket.on('add-todo', () => {
        console.log(`socket updating todo ${counter++} id: ${socket.id}`);
        io.sockets.emit('update-todos');
    });
});
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://Reminders-Development.firebaseio.com'
});
const validate = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(500).send('You are not authorized');
        return;
    }
    admin
        .auth()
        .verifyIdToken(req.headers.authorization)
        .then((decodedToken) => {
        const uid = decodedToken.uid;
        next();
    })
        .catch(error => {
        res.status(500).send(error.message);
        res.end();
        return;
    });
};
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors(options.cors));
app.use(validate);
app.use('/', reminders_1.default);
server.listen(PORT, () => {
    console.log(`[server]: Server is running at ${config_1.default.backend_url}`);
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)(endpoints_config_1.default.MongoDBUrl);
});
run()
    .catch(err => console.log(err));
