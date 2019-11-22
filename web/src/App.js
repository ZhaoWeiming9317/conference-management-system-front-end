import React from 'react'
import { BrowserRouter, Route } from "react-router-dom";

import Login from './containers/login/index'
import Register from './containers/register/index'

class App extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <Route path="/Register" component={Register}></Route>
                <Route path="/login" component={Login}></Route>
            </BrowserRouter>
        )
    }
}

export default App

