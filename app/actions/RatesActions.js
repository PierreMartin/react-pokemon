import alt from '../alt';

class RatesActions {
    constructor() {
        this.generateActions(
            'getOnePokemonSuccess',
            'getOnePokemonFail',
            'ratingSuccess',
            'ratingFail'
        );
    }

    /** afficher 1 pokemon en bdd (en random) **/
    getOnePokemon() {
        /** GET LocalStorage **/
        var pokemonAlreadyVoted = JSON.parse(localStorage.getItem('POK')) || [];

        $.ajax({
                type: "get",
                url: '/api/pokemons',
                data: { pokemonAlreadyVoted: pokemonAlreadyVoted }
            })
            .done(data => {
                this.actions.getOnePokemonSuccess(data);
            })
            .fail(jqXhr => {
                this.actions.getOnePokemonFail(jqXhr.responseJSON.message);
            });
    }

    /** apres le vote, on update un pokemon **/
    updateScore(pokemonId, numberStars) {
        $.ajax({
                type: 'PUT',
                url: '/api/pokemons' ,
                data: { pokemonId: pokemonId, numberStars: numberStars }
            })
            .done(() => {
                this.actions.ratingSuccess(numberStars);
                this.actions.getOnePokemon();   // afficher 1 autre Pokemon s en bdd :
            })
            .fail((jqXhr) => {
                this.actions.ratingFail(jqXhr.responseJSON.message);
            });
    }

}

export default alt.createActions(RatesActions)