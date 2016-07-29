import alt from '../alt';
import PokemonListActions from '../actions/PokemonListActions';
import { replaceSpec } from '../formatString';

class PokemonListStore {
    constructor() {
        this.bindActions(PokemonListActions);
        this.pokemons = [];
    }

    onGetPokemonsSuccess(data) {
        this.pokemons = data;
    }

    onGetPokemonsFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }
}

export default alt.createStore(PokemonListStore);