import { hot } from 'react-hot-loader/root';
import React, { Component} from "react";

class App extends Component{
    render(){
        return(
            <div className="App">
                <h1> Hello, World 4! </h1>
            </div>
        );
    }
}

export default hot(App);