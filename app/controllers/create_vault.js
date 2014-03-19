'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Vault = mongoose.model('Vault');


exports.render = function(req, res) {
    res.render('create_vault', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};

exports.save = function(req, res) {

	if(req.isAuthenticated()){

		var vault = new Vault();
		vault.title = req.body.vault_name;
		vault.end_date = req.body.end_date;
		vault.description = req.body.description;
		vault.vault_bitcoin_amount = req.body.amount;
		vault.user = req.user;
		/*vault.cipher_code = function() {
			console.log('stored function');
		};*/
		if(req.body.ciphers[0] !== undefined){
			vault.cipher_code1 = req.body.ciphers[0];
		}

		if(req.body.ciphers[1] !== undefined){
			vault.cipher_code2 = req.body.ciphers[1];
		}

		if(req.body.ciphers[2] !== undefined){
			vault.cipher_code3 = req.body.ciphers[2];
		}

		vault.save();

		res.end('Vault created successfully!');
	}else{
		res.end('access denied.');
	}

};

// Hakee kaikki voimassaolevat holvit
exports.get_all_vaults = function(req, res) {

	Vault.find({}, function (err, vaults) {

		var userMap = {};


		// TODO: palauta vain tarpeelliset tiedot, nyt palautuu kaikki
		// esim salausfunktiot
		vaults.forEach(function(vault) {
			userMap[vault._id] = vault;
		});

		res.send(userMap);
	});

};