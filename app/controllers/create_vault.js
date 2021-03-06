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

// palauttaa false jos randomia käytetty, muuten true
function testForRandomness(vault){

	var shouldBeSameCryptedPhrases = {};

	for(var i = 0; i < 3; i++){
		var cryptedPhrase = '';
		var passwordPhrase = 'password phrase example';

		if(vault.cipher_code1 !== undefined) {
			cryptedPhrase = vault.cipher_code1(passwordPhrase);
		}
		if(vault.cipher_code2 !== undefined) {
			cryptedPhrase = vault.cipher_code2(cryptedPhrase);
		}
		if(vault.cipher_code3 !== undefined) {
			cryptedPhrase = vault.cipher_code3(cryptedPhrase);
		}

		shouldBeSameCryptedPhrases[i] = cryptedPhrase;
	}

	if(shouldBeSameCryptedPhrases[0] !== shouldBeSameCryptedPhrases[1] ||
		shouldBeSameCryptedPhrases[1] !== shouldBeSameCryptedPhrases[2]){
		return false;
	}else{
		return true;
	}

}

// palauttaa false jos kovakoodausta käytetty, muuten true
function testForHardCoding(vault){

	var cryptedPhrase1 = '';
	var passwordPhrase1 = 'password phrase example';

	if(vault.cipher_code1 !== undefined) {
		cryptedPhrase1 = vault.cipher_code1(passwordPhrase1);
	}
	if(vault.cipher_code2 !== undefined) {
		cryptedPhrase1 = vault.cipher_code2(cryptedPhrase1);
	}
	if(vault.cipher_code3 !== undefined) {
		cryptedPhrase1 = vault.cipher_code3(cryptedPhrase1);
	}

	var cryptedPhrase2 = '';
	var passwordPhrase2 = 'different phrase something';

	if(vault.cipher_code1 !== undefined) {
		cryptedPhrase2 = vault.cipher_code1(passwordPhrase2);
	}
	if(vault.cipher_code2 !== undefined) {
		cryptedPhrase2 = vault.cipher_code2(cryptedPhrase2);
	}
	if(vault.cipher_code3 !== undefined) {
		cryptedPhrase2 = vault.cipher_code3(cryptedPhrase2);
	}

	if(cryptedPhrase1 === cryptedPhrase2){
		return false;
	}else{
		return true;
	}

}


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

		// testataan että käyttäjällä on tarpeeksi massia
		if(req.user.balance < req.body.amount || req.body.amount === 0){
			res.status(404);
			res.end('Not enough balance');
		}else{

			// varmista ettei kovakoodausta
			if(testForHardCoding(vault) === false){
				res.status(404);
				res.end('Hardcoding is not allowed in cipher function');
				return;
			}

			// varmista ettei randomia käytetty
			if(testForRandomness(vault) === false){
				res.status(404);
				res.end('Randomness is not allowed in cipher function');
				return;
			}

			// testataan että generoidun salasanan 
			// pituus ei muutu kun se kryptataan
			if(crypted_password.length === vault.pass_phrase.length){

				vault.save(function (err){
					if(err){
						res.status(404);
						res.end('Vault name is already in use.');
					}else{
						// otetaan käyttäjältä rahaa saman verran pois kun holviin menee
						req.user.balance = req.user.balance - req.body.amount;
						req.user.save();
						res.end();
					}
				});

				
			}else{
				res.status(404);
				res.end('Cipher algorithm cannot change the length of password phrase');
			}
		}
		
	}else{
		res.status(404);
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
			exposed_vault.vault_bitcoin_amount = Math.round(1000 * vault.vault_bitcoin_amount) / 1000;

			if(vault.vault_bitcoin_amount === 0){
				exposed_vault.robbed = true;
			}

			// days left
			// TODO: piilota ryöstösivulta myös

			var oneDay = 24*60*60*1000;
			var today = new Date();

			var diffDays = Math.round(Math.abs((today.getTime() - exposed_vault.end_date.getTime())/oneDay));
			diffDays++;
			exposed_vault.days_left = diffDays;

			exposed_vault.days_active = Math.round(Math.abs((exposed_vault.created.getTime() - today.getTime())/oneDay));

			if(exposed_vault.end_date > today) {
				userMap[vault._id] = exposed_vault;
			}
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

		// Tarkistetaan että mashia
		if(req.user.balance < 0.1){
			res.end('Not enough balance');
		}else {

			// Otetaan mashia pois
			req.user.balance = req.user.balance - 0.1;
			req.user.save();

			Vault.findOne({ title: req.params.vault }, function (err, vault) {

				if (err) {
					res.end(err);
				}else{
					if(vault !== null) {

						if(vault.vault_bitcoin_amount === 0){
							// rahojen palautus
							req.user.balance = req.user.balance + 0.1;
							req.user.save();
							res.end('This vault is already cracked');
						}else{

							// Lisätään holviin 90% arvausmaksusta
							vault.vault_bitcoin_amount = vault.vault_bitcoin_amount + 0.09;
							vault.save();

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
										//ryöstäjä saa saaliinsa
										req.user.balance = req.user.balance + vault.vault_bitcoin_amount;
										req.user.save();

										vault.vault_bitcoin_amount = 0;
										vault.robbery_count = vault.robbery_count + 1;
										vault.save();

										res.end('Vault cracked! Redirecting to main page...');
									}else{
										vault.robbery_count = vault.robbery_count + 1;
										vault.save();
										var length_print = guessWord.length - 2;
										var correct_print = correctCount - 2;
										res.end('Correct char count: ' + correct_print + '/' + length_print);
									}

								}else{
									res.end('Guess length ' + guessWord.length + ' does not match password length: '+
									threeRandomWords.length);
								}
							}else{
								res.end('Error');
							}
						}	
					}else{
						res.end('Cannot find vault');
					}
				}
			});
	
	}

	}else{
		res.end('You need to login first');
	}
};