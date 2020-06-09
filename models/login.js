const connection = require('./database')
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.register = (req, res) => {

    var email    = req.body.email
    var username = req.body.username
    var password = req.body.password

    bcrypt.hash(password, saltRounds, function(err, hash) {

        let sql_register = `INSERT INTO users 
                            SET ?`

        let post = {
            email: email, 
            username: username, 
            password: hash
        }

        connection.query(sql_register, post, (error, rows, fields) => {
            if(error) throw error;
        })
    });

    res.redirect('/')
}

exports.login = (req, res) => {

    var email = req.body.email
    var password = req.body.password

    let sql_login_exists = `SELECT * FROM users 
                            WHERE email = ?`

    connection.query(sql_login_exists, [email], (error, rows, fields) => {
        if (error) throw error
        
        if(rows.length > 0) {

            let sql_login = `SELECT * FROM users 
                            WHERE email = ?`

            connection.query(sql_login, [email], (error, rows, fields)  => {
                
                bcrypt.compare(password, rows[0].password, function(err, result) {
                    if(result) {
                        req.session.loggedin = true
                        req.session.username = rows[0].username
                        req.session.user_id = rows[0].id
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

exports.logout = (req, res)  => {
    req.session.destroy()
    res.redirect('/')
}

exports.changePassword = (req, res) => {

    var currentPassword = req.body.currentPassword
    var newPassword = req.body.passwordNew
    var newPasswordAgain = req.body.passwordNewAgain

    if(newPassword === newPasswordAgain) {

        let sql_user_exists = `SELECT * FROM users
                               WHERE username = ?`

        connection.query(sql_user_exists, [req.session.username], (error, rows, fields) => {
            if(error) throw error;

            bcrypt.compare(currentPassword, rows[0].password, function(err, result) {
                if(result) {

                    bcrypt.hash(newPassword, saltRounds, function(err, hash) {

                        let sql_change_password = `UPDATE users 
                                                   SET password = ? 
                                                   WHERE username = ?`

                        connection.query(sql_change_password, [hash, req.session.username], (error, rows, fields) => {
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

exports.deleteAccount = (req, res) => {
    if(req.session.loggedin) {

        let sql_delete_tweets = `DELETE FROM tweets 
                                 WHERE user = ?`

        connection.query(sql_delete_tweets, [req.session.username], (error, rows, fields) => {
            if(error) throw error;
        })

        let sql_delete_user = `DELETE FROM users 
                               WHERE username = ?`
        
        connection.query(sql_delete_user, [req.session.username], (error, rows, fields) => {
            if(error) throw error;
            
            req.session.destroy()
            res.redirect('/')
        })
    }
    else {
        res.redirect('/')
    }
}