var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var usersRouter = require('./routes/users');
var gamesRouter = require('./routes/games');
var purchasesRouter = require('./routes/purchases');


var app = express();


const sessions = new Map();
const sessionHandler = function (req, res, next) {
    const sessionId = req.cookies.sessionId ?? 'No session in progress';
    const userObject = sessions.get(sessionId);
    console.log(userObject)
    if (userObject === undefined) {
        req.user = "No user logged in";
        req.sessionId = "No session in progress";
        req.role = "Guest"
    } else {
        const ts = Date.now();
        if (ts < userObject.logoutTime) {
            req.user = userObject.login;
            req.userObject = userObject;
            req.sessionId = sessionId;
            req.role = userObject.role;
        } else {
            req.user = "No user logged in";
            req.sessionId = "No session in progress";
            req.role = "Guest"
            sessions.delete(sessionId);
        }

    }
    next();
}
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionHandler);


app.set('sessions',sessions);




app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/purchases', purchasesRouter);





module.exports = app;
