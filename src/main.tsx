import React from 'react';
import ReactDOM from 'react-dom';

import App from './views/App';

import './sass/main.scss';

let counter = 1;

const render = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
}

render();

// 模块热替换的 API
if ((module as any).hot) {
    (module as any).hot.accept('./views/App', () => {
        counter++;
        render();
    });
}