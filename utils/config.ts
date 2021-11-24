const config = {
    frontend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://todoreminders.netlify.app',
    backend_url: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pure-shelf-04149.herokuapp.com',
}

export default config;