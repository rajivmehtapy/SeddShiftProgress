import React, { Component } from "react";
import "./App.css";
import seddCalculation from "./utility/seddCalculation";
import DataSource from "./data/phaseDetail";
import { fromProgressArray, toArray, toVolume } from "@sedd/utils/segment";

const calculate = progress => toVolume(fromProgressArray(progress));
const calculatearray = progress => toArray(fromProgressArray(progress));
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
    // const phases = JSON.parse(this.state.sourcejson).phaseProgress;
    // const target = JSON.parse(this.state.targetjson);
    // this.seddCalculationRef.{ distance: 100, diameter: 30 }convertToSegment(phases, target);
    debugger;
    const obj = calculatearray([
      { diameter: 30, distance: 100 },
      { diameter: 32, distance: 100 }
    ]);
    console.log(obj);
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
