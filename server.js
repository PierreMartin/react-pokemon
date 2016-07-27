/* Point de depart de l'app */

require('babel-register');              // Babel ES6/JSX Compiler
var swig        = require('swig');      // moteur de template
var React       = require('react');
var ReactDOM    = require('react-dom/server');
var Router      = require('react-router');
var routes      = require('./app/routes');
var express     = require('express');
var path        = require('path');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var _           = require('underscore');

// database :
var mongoose    = require('mongoose');
var Pokemon     = require('./models/pokemon');
var config      = require('./config');

var app = express();

// connection a MongoDB :
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});


// les midlewares :
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// GET - permettant d'afficher 2 personnages (en random - du même genre - non voté) en page 'Home'
app.get('/api/pokemons', function(req, res, next) {

    var pokemonIdAlreadyVoted = req.query.pokemonAlreadyVoted;

    if (typeof pokemonIdAlreadyVoted == 'undefined') {
        pokemonIdAlreadyVoted = [];
    }

    /** 2) Requet Mongoose - Fetcher 1 pokemon **/
    Pokemon
        .findOne({ random: { $near: [Math.random(), 0] } })
        .where('_id').nin(pokemonIdAlreadyVoted)
        .exec(function(err, pokemon) {
            if (err) return next(err);

            if (pokemon) {
                return res.send(pokemon);
            } else if (pokemon == null) {
                /** s'il reste plus de pokemon : **/
                return res.send('null');
            }

        });
});


// UPDATE SCORE :
app.put('/api/pokemons', function(req, res, next) {
    var numberStars = parseInt(req.body.numberStars);       // défini dans les 'Actions'  $.ajax({ ... data : { numberStars: xxx, } })
    var pokemonId   = req.body.pokemonId;

    if (!numberStars) {
        return res.status(400).send({ message: "Vote non pris en compte, veillez déplacer légerement le curseur entre 2 votes " });
    }

    Pokemon.findOne({ _id: pokemonId }, function(err, pokemon) {
        if (err) {
            return res.send(err);
        }

        pokemon.totalStars      = pokemon.totalStars + numberStars;
        pokemon.numberOfRating++;
        pokemon.average         = ((pokemon.totalStars / pokemon.numberOfRating) || 0).toFixed(2);

        pokemon.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.status(200).send();
        });
    });

});


// GET CLASSEMENT :
app.get('/api/pokemons/top', function(req, res, next) {
    var params = req.query; // { type/weakness/category: xxx }
    var conditions = {};

    _.each(params, function(value, key) {
        conditions[key] = new RegExp('^' + value + '$', 'i');
    });

    Pokemon
        .find(conditions) // { type: /^eau$/i } || { weakness: /^feu$/i } || {} pour le classement général
        .sort('-average') // Sort in descending order (highest average on top)
        .limit(10)
        .exec(function(err, pokemons) {
            if (err) return next(err);

            res.send(pokemons);
        });
});


// GET SEARCH - recherche un pokemon par son nom - ATTENTION : dois etre placer AVANT app.get('/api/pokemon/:id')
app.get('/api/pokemon/search', function(req, res, next) {
    var pokemonName = new RegExp(req.query.name, 'i'); // permet de rendre la recherche insensible a la casse

    Pokemon.findOne({ name: pokemonName }, function(err, pokemon) {
        if (err) return next(err);

        if (!pokemon) {
            return res.status(404).send({ message: 'Pokemon non trouvé.' });
        }

        res.send(pokemon);
    });
});


// GET SINGLE POKEMON :
app.get('/api/pokemon/:id', function(req, res, next) {
    var id = req.params.id;

    Pokemon.findOne({ _id: id }, function(err, pokemon) {
        if (err) return next(err);

        if (!pokemon) {
            return res.status(404).send({ message: 'pokemon non trouvé.' });
        }

        res.send(pokemon);
    });
});


// Ce Middleware React sert à faire les rendus coté serveur :
app.use(function(req, res) {
    Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);

            // si tout ok :
        } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found server')
        }
    });
});


// SOCKET IO :
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
    onlineUsers++;

    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

    socket.on('disconnect', function() {
        onlineUsers--;
        io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
    });
});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});