'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

require('mongoose-function')(mongoose);

/**
 * Vault Schema
 */
var VaultSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: 'Default title',
        trim: true,
        unique: true
    },
    description: {
        type: String,
        default: 'Default description',
        trim: true
    },
    vault_bitcoin_amount: {
        type: Number,
        default: 0
    },
    hashed_pass_phrase: {
        type: String
    },
    cipher_code1: Function,
    cipher_code2: Function,
    cipher_code3: Function,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
VaultSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
VaultSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Vault', VaultSchema);
