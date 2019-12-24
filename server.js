const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');

// app
const app = express();

//sw
app.get('../frontend/.next/service-worker.js', (req, res) => {
    // Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Content-Type", "application/javascript");
    app.serveStatic(req, res, path.resolve("./.next/service-worker.js"));
});

// db
mongoose
    .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('DB connected'))
    .catch(err => {
        console.log(err);
    });

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}
// routes middleware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

