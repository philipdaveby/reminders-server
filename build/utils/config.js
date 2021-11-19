"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    frontend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:3000',
    backend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'http://localhost:8000',
};
exports.default = config;
