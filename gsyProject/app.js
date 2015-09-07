// API Server to Find matched data from mysql

// require modules mysql and express
var mysql = require('mysql');
var express = require('express');

var app = express();

// set port
var port = process.env.PORT || 8080;

// start the server
app.listen(port);
console.log('Server started! At http:localhost:' + port);

// routes will go here
app.get('/users', function(req, res) {
    // get the param age from localhost/users?age=12
    var user_age = req.param('age');

    // connect to mysql database (provided by gsy)
    var connection = mysql.createConnection({
        "host": "rai.motiondex.com",
        "user": "rai_user",
        "password": "ahUd{2omFmbccC",
        "database": "rai"
    });

    // connection error handle
    connection.connect(function(error) {
        // connected! (unless 'err' is set)
    });

    // when the input url is localhost/users
    if (!user_age) {
        //select all items from table users
        var queryString = 'SELECT * from users';
        //query to get the final result as rows
        connection.query(queryString, function(error, rows) {
            // respond to HTML page
            res.send(rows);
        });
    }
    // when the input url is localhost/users?age=(a number), for example
    // localhost/users?age=12
    else if (!isNaN(user_age)) {
        // select all items WHERE age = (a number), ? is a placeholder
        var queryString = 'SELECT * from users WHERE age = ?';
        //query to get the final result as rows
        //[user_age] is put into the placeholder
        connection.query(queryString, [user_age], function(error, rows) {
            // respond to HTML page
            res.send(rows);
        });
    // when the input url is localhost/users?age=(not a number), for example
    // localhost/users?age=abc
    } else {
        // respond to HTML page
        res.send("Input is invalid");
    }

    // end connection from mysql
    connection.end();
});
