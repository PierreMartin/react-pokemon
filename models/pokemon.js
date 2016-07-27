var mongoose = require('mongoose');

var pokemonSchema = new mongoose.Schema({
    name: String,
    description: String,

    gender: String,
    size: Number,
    weight: Number,
    category: String,
    talent: String,

    type: [String],
    weakness: [String],

    pv: Number,
    attack: Number,
    defense: Number,
    speed: Number,

    totalStars: Number,
    numberOfRating: Number,
    average: { type: Number, default: 0 },

    random: { type: [Number], index: '2d' },
    voted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Pokemon', pokemonSchema);