import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
    constructor() {
        this.bindActions(NavbarActions);    // Méthode Alt magique qui lie les actions au store
        this.onlineUsers = 0;               // va aller dans une <span>
        this.searchQuery = '';              // va aller dans <input value={this.state.searchQuery} />
    }

    /** trouve un pokemon par le nom **/
    onFindPokemonSuccess(payload) {
        payload.history.pushState(null, '/pokemon/' + payload._id); // pour naviguer à la page (via le form de recherche) 
    }

    onFindPokemonFail(payload) {
        payload.searchForm.classList.add('shake');
        setTimeout(() => {
            payload.searchForm.classList.remove('shake');
        }, 1000);
    }

    /** socket io **/
    onUpdateOnlineUsers(data) {
        this.onlineUsers = data.onlineUsers;
    }

    /** valeur de l'input (la recherche) <input onChange={NavbarActions.updateSearchQuery} /> **/
    onUpdateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

}

export default alt.createStore(NavbarStore);