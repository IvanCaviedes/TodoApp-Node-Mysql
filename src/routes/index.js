var express = require('express')
const {getPath} = require('../helpers/index')
var app = express()

app.get('/', function (req, res) {
    res.render(getPath('index'), { title: 'TODO List App' })
})

module.exports = app;