import React from 'react';
import {Route} from 'react-router';
import App from './components/App';                         // componant main (pour les routes) qui contient le footer et la nav-bar

import Rates from './components/Rates';                     // page home
import PokemonSingle from './components/PokemonSingle';     // page single pokemon
import PokemonList from './components/PokemonList';         // page classement pokemon


export default (
    <Route component={App}>
        <Route path='/' component={Rates} />
        <Route path='/pokemon/:id' component={PokemonSingle} />

        {/* permet d'avoir des url de type : http://localhost:3000/type/sol */}
        <Route path=':collection' component={PokemonList}>
            <Route path=':sub_collection' component={PokemonList} />
        </Route>
    </Route>
);