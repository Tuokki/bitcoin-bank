'use strict';

var https = require('https');

/* 
 Tähän ilmeisesti sitten tallennetaan tietokantaan 
 lähetysosoite ja merkitään se odottavaan tilaan

 sitten kun callback tulee tälle maksuosoitteelle niin
 merkataan summa saapuneeksi

 mistä summa?

 1. muodostetaan maksusosoite
 2. jäädään odottamaan maksua -> sirkkeli
 3. jos maksu saapuu niin näytetään teksti "maksu saapunut yms" 
*/

exports.createRecieveAddress = function(req, response) {

		var addr = '1DYTi73EeFK1yr1U8khfStwSHSMQtBPAfC';
		var url = 'http://bitcoinworld.herokuapp.com/username/secret';

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

	// req.user <- tästä tietokantaan kenen maksu
	console.log('testi');

    res.render('deposit', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};
