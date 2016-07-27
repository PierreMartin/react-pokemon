import alt from '../alt';
import PokemonListActions from '../actions/PokemonListActions';

class PokemonListStore {
    constructor() {
        this.bindActions(PokemonListActions);
        this.pokemons       = [];
        this.pokemonsName   = '';
    }

    onGetPokemonsSuccess(data) {
        this.pokemons       = data;
        this.pokemonsName   = data.name;
    }

    onGetPokemonsFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }
}

export default alt.createStore(PokemonListStore);