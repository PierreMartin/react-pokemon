import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
    constructor() {
        // ici sont les données (préparer dans les fonctions suivantes ou provenant direct du componant) à envoyer au store :
        this.generateActions(
            'updateOnlineUsers',            // SOCKET IO
            'updateSearchQuery',            // viens directement du onChange="" de l'input (onChange update les valeurs de l'input à chaque touche enfoncé)

            'findPokemonSuccess',           // trouver un Pokemon par le nom
            'findPokemonFail'
        );
    }

    findCharacter(payload) {
        $.ajax({
                url: '/api/pokemon/search',
                data: { name: payload.searchQuery }
            })
            .done((data) => {
                assign(payload, data); // payload + data
                this.actions.findPokemonSuccess(payload); // on fera dans le Store :  payload._id : récupere l'id de l'objet pokemon
            })
            .fail(() => {
                this.actions.findPokemonFail(payload);
            });
    }
}

export default alt.createActions(NavbarActions);