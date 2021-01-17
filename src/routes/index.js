var express = require('express')
const path = require('path')
var app = express()
 
app.get('/', function(req, res) {
    res.render(path.join(__dirname+'/../views/index'), {title: 'TODO List App'})
})

module.exports = app;