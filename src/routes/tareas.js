var express = require('express')
const { getPath } = require('../helpers/index')
var app = express()

app.get('/add', function (req, res, next) {
    res.render(getPath('tareas/añadir'), {
        title: 'Añadir Nueva Tarea',
        task_name: '',
        task_description: ''
    })
})

app.post('/add', (req, res, next) => {
    req.assert('task_name', 'Name is required').notEmpty()
    req.assert('task_description', 'desciption is required').notEmpty()

    console.log(req.body)
    var errors = req.validationErrors()

    if (!errors) {
        var task = {
            nombre: req.sanitize('task_name').escape().trim(),
            descipcion: req.sanitize('task_description').escape().trim(),
        }
        req.getConnection((error, conn) => {
            conn.query('INSERT INTO tbl_tareas SET ?', task, (err, result) => {
                if (err) {
                    req.flash('error', err)
                    res.render(getPath('tareas/añadir'), {
                        title: 'añadir nueva tarea',
                        task_name: task.task_name,
                        task_description: ''
                    })
                } else {
                    req.flash('success', 'Data added successfully!')
                    res.render(getPath('tareas/añadir'), {
                        title: 'añadir tarea',
                        task_name: '',
                        task_description: ''
                    })
                }
            })
        })
    }
    else {
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        res.render(getPath('tareas/añadir'), {
            title: 'Añadir Nueva Tarea',
            task_name: req.body.task_name,
            task_description: req.body.task_description
        })
    }

})


app.get('/listar', (req, res) => {
    req.getConnection(function (error, conn) {
        conn.query('SELECT * FROM tbl_tareas ORDER BY cod DESC', function (err, rows, fields) {
            if (err) {
                req.flash('error', err)
                res.render(getPath('tareas/listar'), {
                    title: 'Task List',
                    data: ''
                })
            } else {
                res.render(getPath('tareas/listar'), {
                    title: 'Task List',
                    data: rows
                })
            }
        })
    })
})
app.get('/actualizar/:id', (req, res) => {
    req.getConnection(function (error, conn) {
        conn.query('SELECT * FROM tbl_tareas WHERE cod = ' + req.params.id, function (err, rows, fields) {
            if (err) throw err
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/tareas')
            }
            else {
                res.render(getPath('tareas/actualizar'), {
                    title: 'Edit Task',
                    // //data: rows[0],
                    id: rows[0].cod,
                    task_name: rows[0].nombre,
                    task_description: rows[0].descipcion,
                })
            }
        })
    })
})
app.post('/actualizar/:id', (req, res) => {
    req.assert('task_name', 'Name is required').notEmpty()
    req.assert('task_description', 'desciption is required').notEmpty()
    var errors = req.validationErrors()

    if (!errors) {
        var task = {
            nombre: req.sanitize('task_name').escape().trim(),
            descipcion: req.sanitize('task_description').escape().trim(),
        }
        req.getConnection((error, conn) => {
            conn.query('UPDATE tbl_tareas SET ? WHERE cod = ' + req.params.id, task, (err, result) => {
                if (err) {
                    req.flash('error', err)
                    res.render(getPath('tareas/añadir'), {
                        title: 'añadir nueva tarea',
                        task_name: task.task_name,
                        task_description: ''
                    })
                } else {
                    req.flash('success', 'Data added successfully!')
                    res.redirect('/tareas/listar')
                }
            })
        })
    }
    else {
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        res.render(getPath('tareas/añadir'), {
            title: 'Añadir Nueva Tarea',
            task_name: req.body.task_name,
            task_description: req.body.task_description
        })
    }

})

app.post('/eliminar/:id', (req, res) => {
    var user = { id: req.params.id }

    req.getConnection((error, conn) => {
        conn.query('DELETE FROM tbl_tareas WHERE cod = ' + req.params.id, user, (err, result) => {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/tareas')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/tareas/listar')
            }
        })
    })
})

module.exports = app;