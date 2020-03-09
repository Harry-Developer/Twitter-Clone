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

exports.changePassword = function(req, res) {

    var currentPassword = req.body.currentPassword
    var newPassword = req.body.passwordNew
    var newPasswordAgain = req.body.passwordNewAgain

    if(newPassword === newPasswordAgain) {

        connection.query('SELECT * FROM users WHERE username = ?', [req.session.username], function(error, rows, fields) {
            if(error) throw error;

            bcrypt.compare(currentPassword, rows[0].password, function(err, result) {
                if(result) {

                    bcrypt.hash(newPassword, saltRounds, function(err, hash) {
                        connection.query('UPDATE users SET password = ? WHERE username = ?', [hash, req.session.username], function(error, rows, fields) {
                            if(error) throw error;
                        })
                    });

                    res.redirect('/account')

                } else {
                    res.redirect('/')
                }
            });

        })
        
    } else {
        res.redirect('/')
    }
}

exports.deleteAccount = function(req, res) {
    if(req.session.loggedin) {

        connection.query('DELETE FROM tweets WHERE user = ?', [req.session.username], function(error, rows, fields) {
            if(error) throw error;
        })
        
        connection.query('DELETE FROM users WHERE username = ?', [req.session.username], function(error, rows, fields) {
            if(error) throw error;
            console.log('account gone')
            req.session.destroy()
            res.redirect('/')
        })
    }
    else {
        res.redirect('/')
    }
}