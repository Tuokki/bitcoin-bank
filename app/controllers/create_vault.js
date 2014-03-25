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
		vault.location = req.body.location;
		vault.vault_bitcoin_amount = req.body.amount;
		vault.user = req.user;

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
		res.redirect('/');
	}else{
		res.end('access denied.');
	}

};

// Hakee kaikki voimassaolevat holvit
exports.get_all_vaults = function(req, res) {

	Vault.find({}, function (err, vaults) {

		var userMap = {};

		vaults.forEach(function(vault) {

			var exposed_vault = {};
			exposed_vault.title = vault.title;
			exposed_vault.created = vault.created;
			exposed_vault.end_date = vault.end_date;
			exposed_vault.description = vault.description;
			exposed_vault.location = vault.location;
			exposed_vault.robbery_count = vault.robbery_count;
			exposed_vault.vault_bitcoin_amount = vault.vault_bitcoin_amount;
			
			userMap[vault._id] = exposed_vault;
		});

		res.send(userMap);
	});

};