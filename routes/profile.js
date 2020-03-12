const connection = require('./database')


exports.getInfo = function(req, res) {

    var username = req.params.profileName

    if(username === req.session.username) {
        res.redirect('/account')
    } else {

        connection.query('SELECT * FROM tweets WHERE user = ? ORDER BY time DESC', [username], function(error, rows, fields) {
            if (error) throw error

            res.render('pages/profile', {
                total: rows.length,
                id: rows,
                user: rows,
                message: rows
            })

        })
    }

}
