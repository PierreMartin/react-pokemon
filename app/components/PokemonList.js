import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
import StarRating from 'react-star-rating'
import PokemonListStore from '../stores/PokemonListStore';
import PokemonListActions from '../actions/PokemonListActions';
import { replaceSpec } from '../formatString';

class PokemonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = PokemonListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        PokemonListStore.listen(this.onChange);
        PokemonListActions.getPokemons(this.props.params);

        /** Animation css - on cache les items ici **/
        var listGroup = document.querySelector('.list-group');
        listGroup.style.display = 'none';
    }

    componentWillUnmount() {
        PokemonListStore.unlisten(this.onChange);
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.params, this.props.params)) {
            PokemonListActions.getPokemons(this.props.params);
        }

        /** Animation css : **/
        var listGroup = document.querySelector('.list-group');
        listGroup.style.display = 'block';

        var listGroupItem = document.querySelectorAll('.list-group-item');

        var offset = 0;
        for (var i = 0; i < listGroupItem.length; i++) {
            var groupItem = listGroupItem[i];

            groupItem.style.transform = 'translateY(20px)';
            groupItem.style.opacity = '0';

            (function(el) {
                window.setTimeout(function () {
                    el.classList.add('fadeInUp');
                }, 200 + offset)
            })(groupItem);

            offset += 200;
        }

    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        let polemonsList = this.state.pokemons.map((pokemon, index) => {

            var pokemonTypeNode = pokemon.type.map((type, index) => {
                return (
                    <strong key={type}>
                        <div className='label label-primary'>{type}</div>{/*index + 1 == pokemonType.length ? '' : '-'*/}
                    </strong>
                );
            });

            var pokemonWeaknessNode = pokemon.weakness.map((weakness, index) => {
                return (
                    <strong key={weakness}>
                        <div className='label label-danger'>{weakness}</div>{/*index + 1 == pokemonWeakness.length ? '' : '-'*/}
                    </strong>
                );
            });

            return (
                <div key={pokemon._id} className='list-group-item'>
                    <div className='row'>

                        <div className='col-xs-3 item-image'>
                            <span className='position pull-left indexed'>{index + 1}</span>

                            <div className='pull-left thumb-lg'>
                                <Link to={'/pokemon/' + pokemon._id}>
                                    <img className='imgPokemonList' alt="pokemon" src={'/img/' + replaceSpec(pokemon.name) + '_128.jpg'}/>
                                </Link>
                            </div>
                        </div>

                        <div className='col-xs-5 item-content'>
                            <h4 className='media-heading'>
                                <Link to={'/pokemon/' + pokemon._id}>{pokemon.name}</Link>
                            </h4>

                            <div className='table-pok-1'>

                                <div className='table-pok-line'>
                                    <div className='table-pok-title'>Type : </div>
                                    <div className='table-pok-content'>{pokemonTypeNode}</div>
                                </div>

                                <div>
                                    <div className='table-pok-title'>Faiblesse : </div>
                                    <div className='table-pok-content'>{pokemonWeaknessNode}</div>
                                </div>

                                <div>
                                    <div className='table-pok-title'>Catégorie : </div>
                                    <div className='table-pok-content'><div className='label label-default'>{pokemon.category}</div></div>
                                </div>

                            </div>
                        </div>

                        <div className='col-xs-4 text-right table-pok-2 item-infos'>

                            <div className='table-pok-line'>
                                <div className='table-pok-title'>Nombre de fois voté : </div>
                                <div className='table-pok-content'><span className="label label-default label-pill pull-xs-right">{pokemon.numberOfRating}</span></div>
                            </div>

                            <div>
                                <div className='table-pok-title'>Moyenne : </div>
                                <div className='table-pok-content'><span className="label label-default label-pill pull-xs-right">{pokemon.average.toFixed(2)}</span></div>
                            </div>

                            <div>
                                <div className='table-pok-title'>Etoiles : </div>
                                <div className='table-pok-content'><StarRating name="react-star-rating" size={20} totalStars={5} rating={pokemon.average} disabled={true} /></div>
                            </div>

                        </div>

                    </div>

                </div>
            );
        });

        return (
            <div className='container pageList'>
                <div className='list-group'>
                    {polemonsList}
                </div>
            </div>
        );
    }
}

export default PokemonList;