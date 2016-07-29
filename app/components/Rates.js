import React from 'react';
import {Link} from 'react-router';
import StarRating from 'react-star-rating'
import HomeStore from '../stores/RatesStore'
import RatesActions from '../actions/RatesActions';
import { replaceSpec } from '../formatString';

class Rates extends React.Component {
    constructor(props) {
        super(props);
        this.state = HomeStore.getState();              // on récupere les datas modifier du Store
        this.onChange = this.onChange.bind(this);
    }

    /** Lorque le conponant est ready : **/
    componentDidMount() {
        HomeStore.listen(this.onChange);
        RatesActions.getOnePokemon();
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    handleRatingClick(pokemonId, data, e) {
        RatesActions.updateScore(pokemonId, e.rating);
    }

    render() {
        var pokemon         = this.state.pokemon;
        var pokemonName     = this.state.pokemonName;
        var pokemonType     = this.state.type;
        var pokemonWeakness = this.state.weakness;

        var ratingPage;
        if (pokemon !== 'null') {
            var pokemonTypeNode = pokemonType.map((type, index) => {
                return (
                    <span key={type}>
                        <li className='label label-primary'>{type}</li>{/*index + 1 == pokemonType.length ? '' : '-'*/}
                    </span>
                );
            });

            var pokemonWeaknessNode = pokemonWeakness.map((weakness, index) => {
                return (
                    <span key={weakness}>
                        <li className='label label-danger'>{weakness}</li>{/*index + 1 == pokemonWeakness.length ? '' : '-'*/}
                    </span>
                );
            });

            ratingPage =
                <div>
                    <h1 className='text-center'>Donne une note à ce pokemon :</h1>

                    <div className="text-center">
                        <small>conseil : défini une note en fonction de leur rareté, leur puissance, leur qualités</small>
                    </div>

                    <div className='row thumbnailContainer'>
                        <div className='col-sm-8 col-sm-offset-2'>
                            <div className='thumbnail flipInX'>
                                <div className='caption'>
                                    <h2 className='text-center'><Link to={'/pokemon/' + pokemon._id}><strong>{pokemonName}</strong></Link></h2>

                                    <div className='text-center'>
                                        <img className='imgPokemon' alt="pokemon" src={'img/' + replaceSpec(pokemonName) + '_412.jpg'}/>
                                    </div>

                                    <div className='row details'>
                                        <div className='col-sm-6'>
                                            <strong>Catégorie :</strong>
                                            <ul className='list-inline'>
                                            <span>
                                                <li className='label label-default'>{pokemon.category}</li>
                                            </span>
                                            </ul>

                                            <strong>Type :</strong>
                                            <ul className='list-inline'>
                                                {pokemonTypeNode}
                                            </ul>
                                        </div>

                                        <div className='col-sm-6'>
                                            <strong>Faiblesse :</strong>
                                            <ul className='list-inline'>
                                                {pokemonWeaknessNode}
                                            </ul>

                                            <strong>Nombre de fois voté : </strong> {pokemon.numberOfRating}
                                            <br/>
                                            <strong>Moyenne : </strong> {pokemon.average}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='text-center'>
                        <form target="_self" method="GET">
                            <StarRating name="react-star-rating" totalStars={5} onRatingClick={this.handleRatingClick.bind(this, this.state.pokemon._id)} />
                        </form>
                    </div>
                </div>
        } else {
            ratingPage =
                <div className='text-center'>
                    <h3>Tu as donné une note à tous les Pokemons disponible. Tu n'as plus la possibilité de voté pour le moment</h3>
                    <small><code>Info dev : supprimer la clé "POK" dans votre localStorage pour continuer à jouer</code></small>
                </div>
        }

        return (
            <div className='container pageRating'>
                {ratingPage}
            </div>
        );
    }
}

export default Rates;