'use strict';

let path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    $pack = require('./package'),
    app = express();

// use logger
app.use(morgan('dev'));
app.use(express.static('www'));

let port = 3030;

// Bind to a port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});