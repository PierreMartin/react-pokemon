import alt from '../alt';

class PokemonListActions {
    constructor() {
        this.generateActions(
            'getPokemonsSuccess',
            'getPokemonsFail'
        );
    }

    // payload : contient les donnée de routes (ex : http://localhost:3000/types/eau => collection: 'Types', type: 'Eau')
    getPokemons(payload) {
        let url = '/api/pokemons/top';
        let params = {};

        if (payload.collection === 'type') {
            params.type = payload.sub_collection;               // { type: 'eau' }
        } else if (payload.collection === 'faiblesse') {
            params.weakness = payload.sub_collection;           // { weakness: 'eau' }
        } else if (payload.collection === 'categorie') {
            params.category = payload.sub_collection;           // { category: 'ver' }
        } else if (payload.collection === 'top') {
            params = {};
        }

        $.ajax({ url: url, data: params })
            .done((data) => {
                this.actions.getPokemonsSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.getPokemonsFail(jqXhr);
            });
    }
}

export default alt.createActions(PokemonListActions);