import React, {Component} from 'react';
import axios from 'axios';

export class Fib extends Component {
    state = {
        seenIndexes: [],
        seenValues: {},
        index: ''
    }

    componentDidMount() {
        this.fetchIndexes();
        this.fetchValues();
    }

    async fetchIndexes() {
        const { data } = await axios.get('/api/values/all')
        if(data) {
            this.setState({
                seenIndexes: data.map(x => x.index)
            });
        }
    }

    async fetchValues() {
        const values = await axios.get('/api/values/cache');
        if(values.data) {
            this.setState({
                seenValues: values.data
            });
        }
    }

    handleSubmit = async (event) => {
        axios.post('/api/values', {
            index: this.state.index
        });

        this.setState({
            index: ''
        })
    }

    renderIndexes() {
        return this.state.seenIndexes.join(', ');
    }

    renderValues() {
        let values = [];

        for(let key in this.state.seenValues) {
            values.push(
                <div key='key'>
                    For {key} I calculated {this.state.seenValues[key]}
                </div>
            )
        }

        return values;
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter a number: </label>
                    <input
                        input={this.state.index}
                        onChange={event => this.setState({index: event.target.value})}
                        />
                </form>
    
                <h3>Indexes I have seen:</h3>
                    {this.renderIndexes()}
                <h3>Values I have calculated: </h3>
                    {this.renderValues()}
            </div>
        )
    }
}

export default Fib