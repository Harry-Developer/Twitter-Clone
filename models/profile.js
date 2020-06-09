const connection = require('./database')


exports.getInfo = function(req, res) {

    var username = req.params.profileName

    if(username === req.session.username) {
        res.redirect('/account')
    } else {

        connection.query('SELECT * FROM tweets WHERE user = ? ORDER BY time DESC', [username], function(error, rows, fields) {
            if (error) throw error

            if(rows.length > 0) {

                sql_following = "SELECT * FROM User_Followers WHERE user_id = ? AND follower_id = ?"

                let profile_id = rows[0].user_id
                let user_id = req.session.user_id

                connection.query(sql_following, [user_id, profile_id], (error, results, fields) => {
                    if (error) throw error;
                    
                    res.render('pages/profile', {
                        total: rows.length,
                        id: rows,
                        user: rows,
                        message: rows,
                        isFollowing: results.length > 0 ? true : false
                    })

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
            })
        })
    })

    res.redirect('/profile/' + follow_username)

}

exports.unfollowUser = function(req, res) {


    let follow_username = req.params.username;
    let username = req.session.username;

    sql_follower_id = "SELECT * FROM users WHERE username = ?"

    connection.query(sql_follower_id, [follow_username], (error, results, fields) => {
        if (error) throw error;

        follower_id = results[0].id 
        user_id = req.session.user_id
        
        sql_unfollow_user = "DELETE FROM User_Followers WHERE user_id = ? AND follower_id = ?"

        connection.query(sql_unfollow_user, [user_id, follower_id], (error, results, fields) => {
            if (error) throw error;
        })
    })
    
    res.redirect('/profile/' + follow_username)

}

exports.getFollowing = function(req, res) {

    var username = req.params.profileName

    let sql_user_id = "SELECT * FROM users WHERE username = ?"

    connection.query(sql_user_id, [username], (error, results, fields) => {
        if (error) throw error;

        var user_id = results[0].id

        let sql_following = "SELECT * FROM users WHERE id in (SELECT follower_id FROM User_Followers WHERE user_id = ?)"

        connection.query(sql_following, [user_id], (error, results, fields) => {
            if (error) throw error;
    
            res.render('pages/following', {
                data: results
            })
        })
    })
   
}

exports.getFollowers = function(req, res) {

    var username = req.params.profileName

    let sql_user_id = "SELECT * FROM users WHERE username = ?"

    connection.query(sql_user_id, [username], (error, results, fields) => {
        if (error) throw error;

        var user_id = results[0].id

        let sql_following = "SELECT * FROM users WHERE id in (SELECT user_id FROM User_Followers WHERE follower_id = ?)"

        connection.query(sql_following, [user_id], (error, results, fields) => {
            if (error) throw error;
    
            res.render('pages/followers', {
                data: results
            })
        })
    })
}


