"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    frontend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://todoreminders.netlify.app',
    backend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pure-shelf-04149.herokuapp.com',
};
exports.default = config;
