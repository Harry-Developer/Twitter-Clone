const connection = require('./database')

exports.sendTweet = function(req, res) {

    var tweet = req.body.tweetContent;
    
    var post  = {
        user: req.session.username, 
        message: tweet,
        user_id: req.session.user_id
    };

    let sql_add_tweet = `INSERT INTO tweets SET ?`

    connection.query(sql_add_tweet, post, (error, results, fields) => {
        if (error) throw error;
    });

    res.redirect('/')
}

exports.getTweets = function(req, res) {

    var user_id = req.session.user_id;

    let sql_tweets = `SELECT * FROM tweets 
                      WHERE user_id in 
                      (SELECT follower_id FROM User_Followers WHERE user_id = ?) 
                      or user_id = ? 
                      ORDER BY time DESC`

    connection.query(sql_tweets, [user_id, user_id], (error, rows, fields) => {
        if(error) throw error;

        res.render('pages/index', {
            total: rows.length,
            id: rows,
            user: rows,
            message: rows
        })
    })

}

exports.deleteTweet = function(req, res) {
    var tweetId = req.params.id
    var user = req.session.username

    let sql_delete_tweet = `DELETE FROM tweets 
                            WHERE id = ? 
                            AND user = ?`
    
    connection.query(sql_delete_tweet, [tweetId, user], (error, rows, fields) => {
        if(error) throw error;
    })

    res.redirect('/')
}

exports.getUserTweets = function(req, res) { 

    if(!req.session.loggedin) {
        res.redirect('/')
        res.end()
    } else {

        let sql_user_tweets = `SELECT * FROM tweets
                               WHERE user = ?
                               ORDER BY time DESC`

        connection.query(sql_user_tweets, [req.session.username], (error, rows, fields) => {
            if(error) throw error;

            res.render('pages/account', {
                total: rows.length,
                id: rows,
                user: rows,
                message: rows
            })
        })
    }
}