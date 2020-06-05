const connection = require('./database')


exports.getInfo = function(req, res) {

    var username = req.params.profileName

    if(username === req.session.username) {
        res.redirect('/account')
    } else {

        connection.query('SELECT * FROM tweets WHERE user = ? ORDER BY time DESC', [username], function(error, rows, fields) {
            if (error) throw error

            if(rows.length > 0) {

                res.render('pages/profile', {
                    total: rows.length,
                    id: rows,
                    user: rows,
                    message: rows
                })
            } else {
                res.redirect('/')
            }


        })
    }

}

exports.search = function(req, res) {
    var user = req.body.userSearch;

    res.redirect('/profile/' + user)
}

exports.followUser = function(req, res) {

    let follow_username = req.params.username;
    let username = req.session.username;

    var follow_id = 0;
    var user_id = 0;

    let sql_follower = "SELECT id FROM users WHERE username = ?"

    connection.query(sql_follower, follow_username, (error, results, fields) => {
        if(error) throw error;

        follow_id = results[0].id

        let sql_user = "SELECT id FROM users WHERE username = ?"

        connection.query(sql_user, username, (error, results, fields) => {
            if(error) throw error;
    
            user_id = results[0].id

            let sql_follower_insert = "INSERT into User_Followers SET ?"

            let data = {
                user_id: user_id,
                follower_id: follow_id
            }
        
            connection.query(sql_follower_insert, [data], (error, results, fields) => {
                if (error) throw error;
        
                console.log('following added')
            })
        })
    })

    res.redirect('/profile/' + follow_username)

}

