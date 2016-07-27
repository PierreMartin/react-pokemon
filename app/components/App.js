/* Component haut niveau */

import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

class App extends React.Component {
    render() {
        return (
            <div>
                <Navbar history={this.props.history} />
                {this.props.children} {/* ici il y aura tous les componants comme Rates // PokemonList // PokemonSingle */}
                <Footer />
            </div>
        );
    }
}

export default App;