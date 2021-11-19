const config = {
    frontend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:8000',
    backend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'http://localhost:8000',
}

export default config;