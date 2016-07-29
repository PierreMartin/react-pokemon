import alt from '../alt';
import PokemonSingleActions from '../actions/PokemonSingleActions';

class PokemonSingleStore {
    constructor() {
        this.bindActions(PokemonSingleActions);
        this.pokemon        = [];
        this.pokemonName    = ''; // sert uniquement avant le 1er montage du component, permet d'afficher une image blanche '_256.jpg'
        this.type           = [];
        this.weakness       = [];
        this.pokemonIdArray = [];
    }

    onGetPokemonSuccess(data) {
        this.pokemon        = data;
        this.pokemonName    = data.name;
        this.type           = data.type;
        this.weakness       = data.weakness;
        this.pokemonIdArray = JSON.parse(localStorage.getItem('POK')) || [];

        $(document.body).attr('class', 'profile ' + this.pokemonName.toLowerCase()); // ajoute une classe    ex : 'profile pokemon'
    }

    onGetPokemonFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }

    onRatingSuccess(numberStars) {
        /** SET LocalStorage **/
        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
        }

        this.pokemonIdArray.push(this.pokemon._id);
        localStorage.setItem('POK', JSON.stringify(this.pokemonIdArray));

        /** Toastr **/
        toastr.success('Tu as donné une note de ' + numberStars + ' sur 5 à ' + this.pokemonName, 'Merci !');
    }

    onRatingFail(errorMessage) {
        toastr.error(errorMessage);
    }

}

export default alt.createStore(PokemonSingleStore);