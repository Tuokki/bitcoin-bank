'use strict';

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    /* BITCOIN FUNCTIONALITY STARTS */
    
    //Bitcoin handling functions
    var deposit = require('../app/controllers/deposit');
    var withdraw = require('../app/controllers/withdraw');

    //Deposit route
    app.get('/deposit', deposit.render);
    
    //Generate deposit address
    app.get('/generate/:username', deposit.createRecieveAddress);

    //Handle payment callback from blockchain
    app.get('/payment/:username/:secret', deposit.handlePayment);

    //Withdraw route
    app.get('/withdraw', withdraw.render);

    //Send withdraw transaction to blockchain api
    app.get('/send/:username/:address/:amount', withdraw.handleWithdraw);

    /* BITCOIN FUNCTIONALITY ENDS */

    var create_vault = require('../app/controllers/create_vault');
    app.get('/create_vault', create_vault.render);

    app.get('/subapp', function (req, res) {
        res.send('You are on the /sub/subapp page.');
    });

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
