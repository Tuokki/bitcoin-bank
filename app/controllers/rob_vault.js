'use strict';

/**
 * Module dependencies.
 */
//var mongoose = require('mongoose');
//var Vault = mongoose.model('Vault');

exports.render = function(req, res) {
    res.render('rob_vault', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};