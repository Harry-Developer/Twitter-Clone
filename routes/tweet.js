const connection = require('./database')

exports.sendTweet = function(req, res) {

    var tweet = req.body.tweetContent;
    
    var post  = {user: req.session.username, message: tweet};
    var query = connection.query('INSERT INTO tweets SET ?', post, function (error, results, fields) {
        if (error) throw error;
    });

    res.redirect('/')
}

exports.getTweets = function(req, res) {

    connection.query('SELECT * FROM tweets ORDER BY time DESC', function(error, rows, fields) {
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
    
    connection.query('DELETE FROM tweets WHERE id = ? and user = ?', [tweetId, user], function(error, rows, fields) {
        if(error) throw error;
    })

    res.redirect('/')
}

exports.getUserTweets = function(req, res) { 

    if(!req.session.loggedin) {
        res.redirect('/')
        res.end()
    } else {

        connection.query('SELECT * FROM tweets WHERE user = ? ORDER BY time DESC', [req.session.username],function(error, rows, fields) {
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