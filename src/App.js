import React, { Component } from "react";
import "./App.css";
import seddCalculation from "./utility/seddCalculation";
import DataSource from "./data/phaseDetail";
import { fromProgressArray, toArray, toVolume } from "@sedd/utils/segment";

const calculate = progress => toVolume(fromProgressArray(progress));
const calculatearray = progress => toArray(fromProgressArray(progress));
const startingarray = progress => toVolume(fromProgressArray(progress));
const finalarray = progress => toVolume(fromProgressArray(progress));

class App extends Component {
  state = {
    sourcejson: DataSource.ShiftInfo,
    targetjson: DataSource.TargetInfo,
    actualjson: DataSource.ActualArray,
    finaljson:  DataSource.FinalArray
  };
  seddCalculationRef = new seddCalculation();

  onSourceChange = ev => {
    const updatestate = { ...this.state };
    updatestate.sourcejson = ev.currentTarget.value;
    this.setState(updatestate);
  };

  onActualChange= e => {
    const actualstate = { ...this.state};
    actualstate.actualjson = e.currentTarget.value;
    this.setState(actualstate);
  }


  onconversion = () => {
    const phases = JSON.parse(this.state.sourcejson).shiftPhaseProgress;
    const target = JSON.parse(this.state.targetjson);
    const actual = JSON.parse(this.state.actualjson);
    const final =  JSON.parse(this.state.finaljson);

    this.seddCalculationRef.convertToSegment(phases, target, calculate(actual),calculate(final));
    //this.seddCalculationRef.{ distance: 100, diameter: 30 0};
    const obj = calculate([
      { "diameter": "30", "distance": "100" },
      { "diameter": "32", "distance": "100" }
    ]);
    const startfinal = startingarray([
      { "diameter": "36", "distance":"100" },
      { "diameter": "30", "distance":"200" },
      { "diameter": "24", "distance":"300" },
      { "diameter": "11", "distance":"100" }
    ]); 
    const targetfinal = finalarray([
      { "diameter": "36", "distance": "150" },
      { "diameter": "30", "distance": "200" },
      { "diameter": "24", "distance": "300" },
      { "diameter": "11", "distance": "100" }
    ]);
    console.log("Shift Volume",targetfinal-startfinal)
    console.log("volume",obj);
    console.log("Actual volume ******",startfinal);
    console.log("Final Volume",targetfinal);
  };

  render() {
  
    return (
      <React.Fragment>
        <div className="App container_info">
          <div className="container_json">
            <span>Starting <br /> ProgressArray</span>
            <textarea
              onChange={e => this.onActualChange(e)}
              value={this.state.actualjson}
              className="textarea_target"
            />
            <span>Starting Volume:</span>
            
          </div>
          <div className="container_json">
            <span>Raw Json</span>
            <textarea
              onChange={ev => this.onSourceChange(ev)}
              value={this.state.sourcejson}
              className="textarea_source"
            />
            <span>Shift Volume: </span>
          </div>
          <div className="container_json">
            <span>Target Json</span>
            <textarea
              readOnly
              value={this.state.targetjson}
              className="textarea_target"
            />
          </div>
          <div className="container_json">
            <span>Ending <br /> ProgressArray</span>
            <textarea
              readOnly
              value={this.state.finaljson}
              className="textarea_target"
            />
            <span>Ending Volume:</span>
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
