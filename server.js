require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');
const connectDb = require('./config/dbCoon');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const filesMissing = require('./middleware/filesMissing')
const filesSizeLimit = require('./middleware/fileSizeLimit')
const filesExtLimite = require('./middleware/filesExtLimiter')

const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');


// Connect to mongo db 
connectDb();
// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


// test upload files

// app.post('/upload',
//     fileUpload({ createParentPath: true }),
//     filesMissing,
//     filesSizeLimit,
//     filesExtLimite(['.png', '.jpg', '.jpeg']),
//     (req, res) => {
//         const files = req.files;

//         Object.keys(files).forEach(key => {

//             const filePath = path.join(__dirname, 'files', files[key].name)
//             files[key].mv(filePath, (err => {
//                 if (err) return res.status(500).json({ status: "error", message: err })
//             }))
//         })

//         return res.json({ status: 'success', message: Object.keys(files).toString() });
//     }
// )


// these below apis need auth
app.use(verifyJWT);

app.use('/recipes', require('./routes/recipe'));

// app.use('/employees', require('./routes/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to mongo');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
