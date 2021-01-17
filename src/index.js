const express = require('express');
const app = express();
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const cors = require('cors');

const { database, server } = require('./config');

app.use(cors());
app.use(express.json());

app.use(myConnection(mysql, database, 'pool'))

app.set('view engine', 'ejs')


var expressValidator = require('express-validator')
app.use(expressValidator())

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
 
app.use(cookieParser('keyboard cat'))
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())
 

app.listen(server.port, (err) => {
    err ? console.log(err) : console.log(`servidor en el puerto ${server.port}: http://${server.host}:${server.port}`)
})