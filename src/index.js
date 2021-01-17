const express = require('express');
const app = express();

const mysql = require('mysql');

const myConnection = require('express-myconnection');

const { database, server } = require('./config')

var dbOptions = {
    host: database.host,
    user: database.user,
    password: database.password,
    port: database.port,
    database: database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))


app.use('/', (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM clientes', (err, rows) => {
            if (err) {
                res.send({
                    err: err
                })
            }
            else {
                res.send({
                    melo: rows
                })
            }
        })
    })
})

app.listen(server.port, (err) => {
    err ? console.log(err) : console.log(`servidor en el puerto ${server.port}: http://${server.host}:${server.port}`)
})