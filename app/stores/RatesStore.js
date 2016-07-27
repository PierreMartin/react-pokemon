import alt from '../alt';
import RatesActions from '../actions/RatesActions';

class RatesStore {
    constructor() {
        this.bindActions(RatesActions);
        this.pokemon                = [];
        this.pokemonName            = '';
        this.type                   = [];
        this.weakness               = [];
        this.pokemonIdArray         = [];
    }

    onGetOnePokemonSuccess(data) {
        if (data == 'null') {
            this.pokemon        = 'null';
        } else {
            this.pokemon        = data;
            this.pokemonName    = data.name;
            this.type           = data.type;
            this.weakness       = data.weakness;
        }

    }

    onGetOnePokemonFail(errorMessage) {
        toastr.error(errorMessage);
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
        toastr.success('Tu as donnée une note de ' + numberStars + ' sur 5 à ' + this.pokemonName, 'Merci !');

        /** Animation css **/
        var thumbnailEl = document.querySelector('.pageRating .thumbnail');
        thumbnailEl.classList.remove('flipInX');

        window.setTimeout(function () {
            thumbnailEl.classList.add('flipInX');
        }, 30)

    }

    onRatingFail(errorMessage) {
        toastr.error(errorMessage);
    }

}

export default alt.createStore(RatesStore);