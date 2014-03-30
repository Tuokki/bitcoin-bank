'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Vault = mongoose.model('Vault');

var fs = require('fs');
var wordListPath = require('word-list');
var words = fs.readFileSync(wordListPath, 'utf8').split('\n');
var uniqueRandom = require('unique-random')(0, words.length - 1);

exports.render = function(req, res) {
    res.render('create_vault', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};

// sisäinen palvelu
function randomWord() {
    return words[uniqueRandom()];
}

// sisäinen palvelu
// kutsutaan heti kun vault on luotu
// ja päivän välein sen jälkeen jokaiselle aktiiviselle vaultille
function generate_vault_password_phrase(){
    return randomWord() + ' ' + randomWord() + ' ' + randomWord();
}

// sisäinen palvelu
/*function get_vault_clear_password(vault_name) {

	Vault.findOne({ title: vault_name }, function (err, vault) {

			console.log(vault);

			if (err) {
				return console.error(err);
			}else{
				if(vault !== null) {
					return vault.pass_phrase;
				}else{
					return 'Cannot find vault';
				}
			}
		});

}*/

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

		vault.pass_phrase = generate_vault_password_phrase();

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

// rest-palvelu
exports.get_vault_crypted_password = function (req, res) {

	if(req.params.vault !== undefined) {

		Vault.findOne({ title: req.params.vault }, function (err, vault) {
			if (err) {
				return console.error(err);
			}else{
				if(vault !== null) {
					var crypted_password = vault.pass_phrase;
					if(vault.cipher_code1 !== undefined) {
						crypted_password = vault.cipher_code1(crypted_password);
					}
					if(vault.cipher_code2 !== undefined) {
						crypted_password = vault.cipher_code2(crypted_password);
					}
					if(vault.cipher_code3 !== undefined) {
						crypted_password = vault.cipher_code3(crypted_password);
					}

					res.end(crypted_password);
				}else{
					res.end('Cannot find vault');
				}
			}
		});

	}else{
		return res.end('Error');
	}
};

// rest-palvelu
// palauttaa oikeiden kirjainten määrän stringinä
exports.guess = function (req, res) {

	// tarkistetaan että kirjautunut
	if(req.user !== undefined) {

		// TODO: tarkistetaan että mashia
		// TODO: otetaan mashia pois

		Vault.findOne({ title: req.params.vault }, function (err, vault) {

			if (err) {
				res.end(err);
			}else{
				if(vault !== null) {
					var threeRandomWords = vault.pass_phrase;
					var guessWord = req.params.guess;

					if(guessWord !== null && threeRandomWords !== null) {
						if(threeRandomWords.length === guessWord.length) {
							var correctCount = 0;

							for(var i = 0; i < guessWord.length; i++){

								if(guessWord.charAt(i) === threeRandomWords.charAt(i)) {
									correctCount++;
								}

							}

							if(correctCount === guessWord.length){
								res.end('Vault opened!');
							}else{
								res.end('Correct char count: ' + correctCount + '/' + guessWord.length);
							}

						}else{
							res.end('Guess length ' + guessWord.length + ' does not match password length: '+
							threeRandomWords.length);
						}
					}else{
						res.end('Error');
					}
				}else{
					res.end('Cannot find vault');
				}
			}
		});

	}else{
		res.end('You need to login first');
	}
};