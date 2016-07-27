import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-12 text-center'>
                            <h3 className='lead'><strong>Information</strong></h3>
                            <p>Propulsé par <strong>Node.js</strong>, <strong>MongoDB</strong>, <strong>React</strong> et <strong>Flux</strong> (pour l'architecture + le rendu coté serveur).</p>
                            <p>Le code source est disponible sur <a href='https://github.com/' target="_blank">Github</a></p>
                            <p>© 2016 Pierre Mrt.</p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;