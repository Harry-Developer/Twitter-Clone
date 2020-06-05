var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'twitter',
    port     : 8889
});

connection.connect(function(err) {
    if(err)
        console.log("Error: " + err)
    else
        console.log("Database connected!")
});

module.exports = connection
