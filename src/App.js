import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import PhaseCalculation from "./phaseCalculation";
import PhaseProgression from "./phaseProgression";


class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Route path="/" component={PhaseCalculation} exact/>
          <Route path="/progress" component={PhaseProgression} />
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
