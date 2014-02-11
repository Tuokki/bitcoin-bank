'use strict';

var https = require('https');

exports.createRecieveAddress = function(req, response) {

		var addr = '1DYTi73EeFK1yr1U8khfStwSHSMQtBPAfC';
		var url = 'http://bitcoinworld.herokuapp.com/payment/'+req.params.username+'/secret';

		// options for GET
		var optionsget = {
			host : 'blockchain.info',
			port : 443,
			path : '/api/receive?method=create&address='+addr+'&callback='+url,
			method : 'GET'
		};

		var reqGet = https.get(optionsget, function(res) {

			res.on('data', function(d) {
				var obj = JSON.parse(d);
				response.end(obj.input_address);
			});

		});

		reqGet.end();

		reqGet.on('error', function(e) {
			console.error(e);
		});
	
	};

exports.render = function(req, res) {

    res.render('deposit', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};

exports.handlePayment = function(req, res) {

	if(req.params.secret === 'secret' && req.param('value') !== undefined) {
		// console.log('callback recieved:'+req.params.username+':'+req.params.secret);
		
		// HAE KANNASTA
		var user = req.user;

		var value_in_satoshi = req.param('value');
		var value_in_btc = value_in_satoshi / 100000000;
		var value_in_m_btc = value_in_btc * 1000;

		var balance = user.balance + value_in_m_btc;
		user.balance = balance;
		user.save();
	}else{
		console.log('could not get money or secret is wrong');
	}

	res.end('*ok*');
};