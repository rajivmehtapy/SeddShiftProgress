import React, { Component } from "react";
import "./App.css";
import seddCalculation from "./utility/seddCalculation";
import DataSource from "./data/phaseDetail";
import { fromProgressArray, toArray, toVolume } from "@sedd/utils/segment";

const calculate = progress => toVolume(fromProgressArray(progress));
// const calculatearray = progress => toArray(fromProgressArray(progress));
const startingarray = progress => toVolume(fromProgressArray(progress));
const finalarray = progress => toVolume(fromProgressArray(progress));

class App extends Component {
  state = {
    sourcejson: DataSource.ShiftInfo,
    targetjson: DataSource.TargetInfo,
    actualjson: DataSource.ActualArray,
    finaljson: "",
    actualvolume: 0,
    finalvolume: 0,
    shiftvolume: 0
  };
  seddCalculationRef = new seddCalculation();
  workUnitList = [];
  finalprogressList = [];
  onSourceChange = ev => {
    const updatestate = { ...this.state };
    updatestate.sourcejson = ev.currentTarget.value;
    //this.setState(updatestate);
    this.calculateFinalProgress(3, ev.currentTarget.value);
  };

  onActualChange = e => {
    const actualstate = { ...this.state };
    actualstate.actualjson = e.currentTarget.value;
    //this.setState(actualstate);
    this.calculateFinalProgress(2, e.currentTarget.value);
  };

  componentDidMount() {
    this.calculateFinalProgress(1);
  }

  calculateFinalProgress(flag, startjson) {
    this.finalprogressList = [];
    this.workUnitList = [];
    // eslint-disable-next-line default-case
    if (flag == 3) {
      JSON.parse(startjson).shiftPhaseProgress.map(shift => {
        shift.workUnits.map(workunit => {
          this.workUnitList.push({
            diameter: workunit.boreSize,
            distance: workunit.distance
          });
        });
      });
    } else {
      JSON.parse(this.state.sourcejson).shiftPhaseProgress.map(shift => {
        shift.workUnits.map(workunit => {
          this.workUnitList.push({
            diameter: workunit.boreSize,
            distance: workunit.distance
          });
        });
      });
    }
    var startprogresslist = [];
    // eslint-disable-next-line default-case
    switch (flag) {
      case 1:
        startprogresslist = JSON.parse(this.state.actualjson);
        break;
      case 2:
        startprogresslist = JSON.parse(startjson);
        break;
      case 3:
        startprogresslist = JSON.parse(this.state.actualjson);
        break;
    }

    // startprogresslist.map(unit => {
    //   const target = this.workUnitList.filter(
    //     workunit => workunit.diameter === Number(unit.diameter)
    //   );
    //   if (target.length > 0) {
    //     const obj = {
    //       diameter: unit.diameter,
    //       distance: Number(unit.distance) + Number(target[0].distance)
    //     };
    //     this.finalprogressList.push(obj);
    //   } else {
    //     this.finalprogressList.push(unit);
    //   }
    // });
    //debugger;
    //this.finalprogressList = startprogresslist.concat(this.workUnitList);
    this.finalprogressList = toArray(
      fromProgressArray(startprogresslist.concat(this.workUnitList))
    );
    debugger;
    console.log(calculate(toArray(fromProgressArray(DataSource.checkArray))));
    switch (flag) {
      case 1:
        this.setState({
          ...this.state,
          actualvolume: startingarray(JSON.parse(this.state.actualjson)),
          shiftvolume: startingarray(this.workUnitList),
          finalvolume: startingarray(this.finalprogressList),
          finaljson: JSON.stringify(this.finalprogressList)
        });
        break;
      case 2:
        this.setState({
          ...this.state,
          actualvolume: startingarray(JSON.parse(startjson)),
          shiftvolume: startingarray(this.workUnitList),
          finalvolume: startingarray(this.finalprogressList),
          actualjson: startjson,
          finaljson: JSON.stringify(this.finalprogressList)
        });
        break;
      case 3:
        this.setState({
          ...this.state,
          actualvolume: startingarray(JSON.parse(this.state.actualjson)),
          shiftvolume: startingarray(this.workUnitList),
          finalvolume: startingarray(this.finalprogressList),
          sourcejson: startjson,
          finaljson: JSON.stringify(this.finalprogressList)
        });
        break;
      default:
        break;
    }
    // const updatedState = { ...this.state };
    // updatedState.actualvolume = startingarray();
    // // updatedState.finalvolume = targetfinal;
    // // updatedState.shiftvolume = targetfinal - startfinal;
    // this.setState(updatedState);
  }

  onconversion = () => {
    const phases = JSON.parse(this.state.sourcejson).shiftPhaseProgress;
    const target = JSON.parse(this.state.targetjson);
    const actual = JSON.parse(this.state.actualjson);
    const final = JSON.parse(this.state.finaljson);

    this.seddCalculationRef.convertToSegment(
      phases,
      target,
      calculate(actual),
      calculate(final)
    );
    //this.seddCalculationRef.{ distance: 100, diameter: 30 0};
    const obj = calculate([
      { diameter: "30", distance: "100" },
      { diameter: "32", distance: "100" }
    ]);
    const startfinal = startingarray([
      { diameter: "36", distance: "100" },
      { diameter: "30", distance: "200" },
      { diameter: "24", distance: "300" },
      { diameter: "11", distance: "100" }
    ]);
    const targetfinal = finalarray([
      { diameter: "36", distance: "150" },
      { diameter: "30", distance: "200" },
      { diameter: "24", distance: "300" },
      { diameter: "11", distance: "100" }
    ]);
    console.log("Progress Array", this.state.actualjson);
    console.log("Shift Volume", targetfinal - startfinal);
    // console.log("volume", obj);
    console.log("Actual volume", startfinal);
    console.log("Final Array", this.state.finaljson);
    console.log("Final Volume", targetfinal);
    const updatedState = { ...this.state };
    updatedState.actualvolume = startfinal;
    updatedState.finalvolume = targetfinal;
    updatedState.shiftvolume = targetfinal - startfinal;
    this.setState(updatedState);
  };

  render() {
    return (
      <React.Fragment>
        <div className="App container_info">
          <div className="container_json">
            <span>
              Starting <br /> ProgressArray
            </span>
            <textarea
              onChange={e => this.onActualChange(e)}
              value={this.state.actualjson}
              className="textarea_target"
            />
            <span>Starting Volume:{this.state.actualvolume}</span>
          </div>
          <div className="container_json">
            <span>Raw Json</span>
            <textarea
              onChange={ev => this.onSourceChange(ev)}
              value={this.state.sourcejson}
              className="textarea_source"
            />
            {/* <span>Shift Volume:{this.state.shiftvolume}</span> */}
          </div>
          {/* <div className="container_json">
            <span>Target Json</span>
            <textarea
              readOnly
              value={this.state.targetjson}
              className="textarea_target"
            />
          </div> */}
          <div className="container_json">
            <span>
              Ending <br /> ProgressArray
            </span>
            <textarea
              readOnly
              value={this.state.finaljson}
              className="textarea_target"
            />
            <span>Ending Volume:{this.state.finalvolume}</span>
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
