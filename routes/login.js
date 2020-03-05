const connection = require('./database')
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.register = function(req, res) {

    var email    = req.body.email
    var username = req.body.username
    var password = req.body.password

    bcrypt.hash(password, saltRounds, function(err, hash) {
        let post = {email: email, username: username, password: hash}
        connection.query('INSERT INTO users SET ?', post, function(error, rows, fields) {
            if(error) throw error;
        })
    });

    res.redirect('/')
}

exports.login = function(req, res) {

    var email = req.body.email
    var password = req.body.password

    connection.query('SELECT * FROM users WHERE email = ?', [email], function(error, rows, fields) {
        if (error) throw error
        
        if(rows.length > 0) {
            connection.query('SELECT * FROM users WHERE email = ?', [email], function(error, rows, fields) {
                
                bcrypt.compare(password, rows[0].password, function(err, result) {
                    if(result) {
                        req.session.loggedin = true
                        req.session.username = rows[0].username
                        res.redirect('/')
                    } else {
                        res.redirect('/')
                    }
                });
            
            })
        } else {
            res.redirect('/')
        }
    })

}

exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/')
}