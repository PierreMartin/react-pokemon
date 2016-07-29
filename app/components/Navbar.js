import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';        // on récupere les nouvelles données
import NavbarActions from '../actions/NavbarActions';   // on envoie les actions

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = NavbarStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        NavbarStore.listen(this.onChange);

        /** SOCKET IO (coté client) **/
        let socket = io.connect();

        socket.on('onlineUsers', (data) => {
            NavbarActions.updateOnlineUsers(data);
        });
    }

    componentWillUnmount() {
        NavbarStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    /** Formulaire de recherche **/
    handleSubmit(event) {
        event.preventDefault();

        let searchQuery = this.state.searchQuery.trim();

        if (searchQuery) {
            NavbarActions.findCharacter({
                searchQuery: searchQuery,               // input - on récupere le nom à chercher
                searchForm: this.refs.searchForm,       // form - permet de faire une animation sur cet element html
                history: this.props.history             // On envoie "history" dans les actions afin qu'on puisse naviguer à une page "pokemonSingle" directement depuis la recherche
            });
        }
    }

    render() {
        return (
            <nav className='navbar navbar-default navbar-static-top'>
                <div className="container">

                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>

                    <div id='navbarForm' className='navbar-collapse collapse'>
                        <div className='onlineUsers'>
                            <span className='badge badge-up badge-danger'>{this.state.onlineUsers}</span> {this.state.onlineUsers > 1 ? 'personnes' : 'personne'} actuellement sur l'app
                        </div>

                        <form ref='searchForm' className='navbar-form navbar-right' onSubmit={this.handleSubmit.bind(this)}>
                            <div className='input-group'>
                                <input type='text' className='form-control' placeholder="Chercher un Pokemon" value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
                                <span className='input-group-btn'>
                                    <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
                                </span>
                            </div>
                        </form>
                    </div>

                    <hr className="reset-margin"/>

                    <div id='navbar' className='navbar-collapse collapse'>
                        <ul className='nav navbar-nav'>
                            <li><Link to='/top'>Le classement</Link></li>
                            <li><Link to='/'>Voter !</Link></li>

                            <li classNadropdownme='dropdown'>
                                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Classement par <span className='caret'></span></a>
                                <ul className='dropdown-menu'>
                                    <li className='dropdown-submenu'>
                                        <a>Types</a>
                                        <ul className='dropdown-menu'>
                                            <li><Link to='/type/feu'>Feu</Link></li>
                                            <li><Link to='/type/vol'>Vol</Link></li>
                                            <li><Link to='/type/insect'>Insect</Link></li>
                                            <li><Link to='/type/elektric'>Electrik</Link></li>
                                        </ul>
                                    </li>
                                    <li className='divider'></li>
                                    <li className='dropdown-submenu'>
                                        <a>Faiblesses</a>
                                        <ul className='dropdown-menu'>
                                            <li><Link to='/faiblesse/feu'>Feu</Link></li>
                                            <li><Link to='/faiblesse/vol'>Vol</Link></li>
                                            <li><Link to='/faiblesse/roche'>Roche</Link></li>
                                            <li><Link to='/faiblesse/elektric'>Electrik</Link></li>
                                        </ul>
                                    </li>
                                    <li className='divider'></li>
                                    <li className='dropdown-submenu'>
                                        <a>Catégories</a>
                                        <ul className='dropdown-menu'>
                                            <li><Link to='/categorie/ver'>Ver</Link></li>
                                            <li><Link to='/categorie/souris'>Souris</Link></li>
                                            <li><Link to='/categorie/lezard'>Lezard</Link></li>
                                            <li><Link to='/categorie/minoiseau'>Minoiseau</Link></li>
                                            <li><Link to='/categorie/papillon'>Papillon</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                        </ul>
                    </div>

                </div>
            </nav>

        );
    }
}

export default Navbar;