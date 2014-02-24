'use strict';

var https = require('https');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.render = function(req, res) {

    res.render('withdraw', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};

exports.handleWithdraw = function(req, res) {

	if(req.params.amount !== undefined && req.params.username !== undefined && req.params.address !== undefined){

		var fee_in_satoshi = 10000;
		var addr = req.params.address;
		var amount_in_satoshi = req.params.amount*100000;

		// tarkista että käyttäjä olemassa ja tilillä riittävästi rahaa
		User.findOne({ username: req.params.username }, function(err, user) {
			if (err) {
				return console.error(err);
			}else{
				if(user !== null){
					if((user.balance*100000) >= (amount_in_satoshi+fee_in_satoshi)){

						// options for GET
						var optionsget = {
							host : 'blockchain.info',
							port : 443,
							path : '/merchant/L1efrsMne95RLnD9eis5TkdYiq7U8j4SKmJ6fcQJ2A188ZWCoUYF/payment?to='+
									addr+'&amount='+amount_in_satoshi,
							method : 'GET'
						};

						var reqGet = https.get(optionsget, function(response) {

							response.on('data', function(d) {
								var obj = JSON.parse(d);
								if(obj.error !== undefined){
									res.end('Error: ' + obj.error);
								}else{
									res.end(obj.message);
									var newbalance = user.balance - ((amount_in_satoshi+fee_in_satoshi)/100000);
									user.balance = newbalance;
									user.save();
								}
							});

						});

						reqGet.end();

						reqGet.on('error', function(e) {
							console.error(e);
						});
					}else{
						res.end('Error: Balance not sufficient in your account');
					}
				}else{
					console.log('Could not find user: '+req.params.username);
				}
			}
		});

	}else{
		res.end('error');
	}

};