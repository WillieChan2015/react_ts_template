import React from 'react';

interface IState {
    count: number;
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            count: 1
        };
    }

    addCount = () => {
        let count = this.state.count;
        this.setState({
            count: count + 1
        });
    }

    render() {
        return (
            <div>
                <h2 className="red">hello world!</h2>
                <p>test</p>
                <p>count: {this.state.count}</p>
                <button onClick={this.addCount}>+1</button>
            </div>
        )
    }
}

export default App;