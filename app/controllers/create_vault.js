'use strict';

exports.render = function(req, res) {
    res.render('create_vault', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};