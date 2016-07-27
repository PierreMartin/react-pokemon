import alt from '../alt';

class PokemonSingleActions {
    constructor() {
        this.generateActions(
            'getPokemonSuccess',
            'getPokemonFail',
            'ratingSuccess',
            'ratingFail'
        );
    }

    getPokemon(pokemonId) {
        $.ajax({ url: '/api/pokemon/' + pokemonId })
            .done((data) => {
                this.actions.getPokemonSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.getPokemonFail(jqXhr);
            });
    }

    /** apres le vote, on update un vote **/
    updateScore(pokemonId, numberStars) {
        $.ajax({
                type: 'PUT',
                url: '/api/pokemons' ,
                data: { pokemonId: pokemonId, numberStars: numberStars }
            })
            .done(() => {
                this.actions.ratingSuccess(numberStars);
                this.actions.getPokemon(pokemonId);
            })
            .fail((jqXhr) => {
                this.actions.ratingFail(jqXhr.responseJSON.message);
            });
    }

}

export default alt.createActions(PokemonSingleActions);