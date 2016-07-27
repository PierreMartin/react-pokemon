import React from 'react';
import PokemonStore from '../stores/PokemonSingleStore';
import PokemonActions from '../actions/PokemonSingleActions';
import StarRating from 'react-star-rating'

class PokemonSingle extends React.Component {
    constructor(props) {
        super(props);
        this.state = PokemonStore.getState();     // on récupere les datas modifier du Store
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        PokemonStore.listen(this.onChange);
        PokemonActions.getPokemon(this.props.params.id);

        $('.magnific-popup').magnificPopup({
            type: 'image',
            mainClass: 'mfp-zoom-in',
            closeOnContentClick: true,
            midClick: true,
            zoom: {
                enabled: true,
                duration: 300
            }
        });
    }

    componentWillUnmount() {
        PokemonStore.unlisten(this.onChange);
        $(document.body).removeClass();
    }

    componentDidUpdate(prevProps) {  // prevProps : Pokemon ID de l'url
        // Fetch new pokemon quand l'URL change :
        if (prevProps.params.id !== this.props.params.id) {
            PokemonActions.getPokemon(this.props.params.id);
        }
    }

    onChange(state) {
        this.setState(state);
    }

    handleRatingClick(data, e) {
        PokemonActions.updateScore(this.props.params.id, e.rating);
    }

    render() {

        /** si deja voté, alors on n'affiche pas les étoiles de vote **/
        var ifAlreadyVoted = false;
        var starRatingNode;
        var pokemonId = this.state.pokemon._id; // on dois stoker this.xxx.xxx dans une variable sinon erreur à cause de React !

        if (typeof pokemonId !== 'undefined') {
            this.state.pokemonIdArray.forEach(function(pokemonIdInSession) {
                if (pokemonIdInSession == pokemonId) {
                    ifAlreadyVoted = true;
                    //console.log(pokemonIdInSession);
                }
            });
        }

        if (ifAlreadyVoted) {
            starRatingNode = <div className='alert alert-info'><span className='glyphicon glyphicon-ok'></span> Vous avez voté pour se Pokemon</div>;
        } else {
            starRatingNode =
                <div>
                    <h2>Donner une note : </h2>
                    <form target="_self" method="GET">
                        <StarRating name="react-star-rating" totalStars={5} onRatingClick={this.handleRatingClick.bind(this)} />
                    </form>
                </div>;
        }


        /** Liste des types **/
        var pokemonTypeNode = this.state.type.map((type, index) => {
            return (
                <span key={type}>
                    <li className='label label-primary'>{type}</li>{/*index + 1 == pokemonType.length ? '' : '-'*/}
                </span>
            );
        });

        /** Liste des Faiblesses **/
        var pokemonWeaknessNode = this.state.weakness.map((weakness, index) => {
            return (
                <span key={weakness}>
                    <li className='label label-danger'>{weakness}</li>{/*index + 1 == pokemonWeakness.length ? '' : '-'*/}
                </span>
            );
        });

        return (
            <div className='container pageSingle'>
                <div className='row'>
                    <div className='col-sm-10 col-sm-offset-1'>
                        <h1 className='text-center'>{this.state.pokemonName}</h1>

                        <div className='profile-img text-center'>
                            <a className='magnific-popup' href={'/img/' + this.state.pokemonName + '_412.jpg'}>
                                <img src={'/img/' + this.state.pokemonName + '_412.jpg'} className='imgPokemon' alt="pokemon" />
                            </a>
                        </div>

                        <p className='lead text-center'>
                            {this.state.pokemon.description}
                        </p>

                        <div className='pokemon-container-infos'>
                            <div className='row'>
                                <div className='col-xs-6 pokemon-main-info'>
                                    <strong>Catégorie :</strong>
                                    <ul className='list-inline'>
                                        <span>
                                        <li className='label label-default'>{this.state.pokemon.category}</li>
                                        </span>
                                    </ul>

                                    <strong>Type :</strong>
                                    <ul className='list-inline'>
                                        {pokemonTypeNode}
                                    </ul>

                                    <strong>Faiblesse :</strong>
                                    <ul className='list-inline'>
                                        {pokemonWeaknessNode}
                                    </ul>
                                </div>

                                <div className='col-xs-6 pokemon-stats-info'>
                                    <h4>Stats de base : </h4>

                                    <div><strong>PV : </strong> {this.state.pokemon.pv} / 10</div>
                                    <div><strong>Attaque : </strong> {this.state.pokemon.attack} / 10</div>
                                    <div><strong>Défense : </strong> {this.state.pokemon.defense} / 10</div>
                                    <div><strong>Vitesse : </strong> {this.state.pokemon.speed} / 10</div>
                                </div>
                            </div>
                        </div>

                        <div className='pokemon-rating-info text-center'>
                            <strong>Cumul des étoiles : </strong> {this.state.pokemon.totalStars}
                            <br/>
                            <strong>Nombre de fois voté : </strong> {this.state.pokemon.numberOfRating}
                            <br/>
                            <strong>Moyenne : </strong> {this.state.pokemon.average}
                        </div>

                    </div>

                </div>

                <div className='star-rating text-center'>
                    {starRatingNode}
                </div>
            </div>
        );
    }
}

export default PokemonSingle;