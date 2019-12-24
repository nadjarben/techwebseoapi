const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const next = require('next');
const { createServer } = require('http')
require('dotenv').config();
// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');

// app
const server = express();

// db
mongoose
    .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('DB connected'))
    .catch(err => {
        console.log(err);
    });

// middlewares
server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(cookieParser());
// cors
if (process.env.NODE_ENV === 'development') {
    server.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}
// routes middleware
server.use('/api', blogRoutes);
server.use('/api', authRoutes);
server.use('/api', userRoutes);
server.use('/api', categoryRoutes);
server.use('/api', tagRoutes);
server.use('/api', formRoutes);

// port
//const port = process.env.PORT || 8000;
//app.listen(port, () => {
//    console.log(`Server is running on port ${port}`);
//});
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: '../frontend',
  });
  const handle = app.getRequestHandler()

  app.prepare()
    .then(() => {
      createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname } = parsedUrl
  
        // handle GET request to /service-worker.js
          const filePath = ('../frontend/.next/service-worker.js')
  
          app.serveStatic(req, res, filePath)
          })
      .listen(8000, () => {
        console.log(`> Ready on http://localhost:${8000}`)
      })
    })