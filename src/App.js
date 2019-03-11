import React, { Component } from "react";
import "./App.css";
import seddCalculation from "./utility/seddCalculation";
import DataSource from "./data/phaseDetail";
class App extends Component {
  state = {
    sourcejson: DataSource.ShiftInfo,
    targetjson: DataSource.TargetInfo
  };
  seddCalculationRef = new seddCalculation();

  onSourceChange = ev => {
    const updatestate = { ...this.state };
    updatestate.sourcejson = ev.currentTarget.value;
    this.setState(updatestate);
  };

  onconversion = () => {
    //this.seddCalculationRef.ping("gd");
  };

  render() {
    return (
      <React.Fragment>
        <div className="App container_info">
          <div className="container_json">
            <span>Raw Json</span>
            <textarea
              onChange={ev => this.onSourceChange(ev)}
              value={this.state.sourcejson}
              className="textarea_source"
            />
          </div>
          <div className="container_json">
            <span>Target Json</span>
            <textarea
              readOnly
              value={this.state.targetjson}
              className="textarea_target"
            />
          </div>
        </div>
        <div className="container_button">
          <button onClick={() => this.onconversion()}>
            Convert to Segments
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
