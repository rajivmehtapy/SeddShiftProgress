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
    sourcejson: DataSource.ShiftWorkUnits,
    targetjson: DataSource.TargetInfo,
    actualjson: DataSource.ActualArray,
    finaljson: "",
    actualvolume: 0,
    finalvolume: 0,
    shiftvolume: 0,
    drillPlan: `{"diameter":48,"distance":1500}`,
    openPhaseWeight: 47,
    PilotPlan: `{"diameter":11,"distance":1500}`,
    DrillWeight: 25,
    OpenPhasePoint: 0,
    DrillPoints: 0,
    ContractPoints: 0,
    TotalVolumes: 0,
    PilotVolume: 0,
    OpenPhaseVolume: 0,
    shiftVolumeDisplay: 0,
    snapShots: []
  };

  seddCalculationRef = new seddCalculation();
  workUnitList = [];
  finalprogressList = [];

  onSourceChange = ev => {
    if (ev.key === "Enter") {
      const updatestate = { ...this.state };
      updatestate.sourcejson = ev.currentTarget.value;
      this.calculateFinalProgress(3, ev.currentTarget.value);
    }
  };

  onSourceChangeUser = ev => {
    this.setState({ ...this.state, sourcejson: ev.currentTarget.value });
  };

  onActualChange = e => {
    if (e.key === "Enter") {
      const actualstate = { ...this.state };
      actualstate.actualjson = e.currentTarget.value;
      this.calculateFinalProgress(2, e.currentTarget.value);
    }
  };

  onActualChangeUser = e => {
    this.setState({ ...this.state, actualjson: e.currentTarget.value });
  };

  onDrillPlanKeyPress = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          ...this.state,
          drillPlan: e.currentTarget.value
        },
        () => {
          this.calculateFinalProgress(2, this.state.actualjson);
        }
      );
    }
  };

  onDrillPlan = e => {
    this.setState({ ...this.state, drillPlan: e.currentTarget.value });
  };

  onOpenPhaseWeight = e => {
    this.setState(
      { ...this.state, openPhaseWeight: e.currentTarget.value },
      () => {
        this.calculateFinalProgress(2, this.state.actualjson);
      }
    );
  };

  onPilotPlan = e => {
    this.setState({ ...this.state, PilotPlan: e.currentTarget.value }, () => {
      this.calculateFinalProgress(2, this.state.actualjson);
    });
  };

  onDrillWeight = e => {
    this.setState({ ...this.state, DrillWeight: e.currentTarget.value }, () => {
      this.calculateFinalProgress(2, this.state.actualjson);
    });
  };

  componentDidMount() {
    this.calculateFinalProgress(1);
  }

  calculateFinalProgress = (flag, startjson) => {
    this.finalprogressList = [];
    this.workUnitList = [];
    if (flag == 3) {
      this.workUnitList = JSON.parse(startjson);
    } else {
      this.workUnitList = JSON.parse(this.state.sourcejson);
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

    this.finalprogressList = toArray(
      fromProgressArray(startprogresslist.concat(this.workUnitList))
    );
    const TotalVolume = calculate(
      toArray(fromProgressArray([JSON.parse(this.state.drillPlan)]))
    );
    const PilotVolume = calculate(
      toArray(fromProgressArray([JSON.parse(this.state.PilotPlan)]))
    );

    switch (flag) {
      case 1:
        const shiftvolume =
          startingarray(this.finalprogressList) -
          startingarray(JSON.parse(this.state.actualjson));
        const OpenPhasePoint = shiftvolume / (TotalVolume - PilotVolume);
        const DrillPoints = OpenPhasePoint * (this.state.openPhaseWeight / 100);
        const ContractPoints = DrillPoints * (this.state.DrillWeight / 100);

        this.setState({
          ...this.state,
          actualvolume: startingarray(JSON.parse(this.state.actualjson)),
          shiftvolume: startingarray(this.workUnitList),
          finalvolume: startingarray(this.finalprogressList),
          finaljson: JSON.stringify(this.finalprogressList),
          TotalVolumes: TotalVolume,
          PilotVolume: PilotVolume,
          OpenPhaseVolume: TotalVolume - PilotVolume,
          OpenPhasePoint: OpenPhasePoint,
          DrillPoints: DrillPoints,
          ContractPoints: ContractPoints,
          shiftVolumeDisplay:
            startingarray(this.finalprogressList) -
            startingarray(JSON.parse(this.state.actualjson))
        });
        break;
      case 2:
        const shiftvolume2 =
          startingarray(this.finalprogressList) -
          startingarray(JSON.parse(startjson));
        const OpenPhasePoint2 = shiftvolume2 / (TotalVolume - PilotVolume);
        const DrillPoints2 =
          OpenPhasePoint2 * (this.state.openPhaseWeight / 100);
        const ContractPoints2 = DrillPoints2 * (this.state.DrillWeight / 100);

        this.setState({
          ...this.state,
          actualvolume: startingarray(JSON.parse(startjson)),
          shiftvolume: startingarray(this.workUnitList),
          finalvolume: startingarray(this.finalprogressList),
          actualjson: startjson,
          finaljson: JSON.stringify(this.finalprogressList),
          TotalVolumes: TotalVolume,
          PilotVolume: PilotVolume,
          OpenPhaseVolume: TotalVolume - PilotVolume,
          OpenPhasePoint: OpenPhasePoint2,
          DrillPoints: DrillPoints2,
          ContractPoints: ContractPoints2,
          shiftVolumeDisplay: shiftvolume2
        });
        break;
      case 3:
        const shiftvolume3 =
          startingarray(this.finalprogressList) -
          startingarray(JSON.parse(this.state.actualjson));
        const OpenPhasePoint3 = shiftvolume3 / (TotalVolume - PilotVolume);
        const DrillPoints3 =
          OpenPhasePoint3 * (this.state.openPhaseWeight / 100);
        const ContractPoints3 = DrillPoints3 * (this.state.DrillWeight / 100);

        this.setState({
          ...this.state,
          actualvolume: startingarray(JSON.parse(this.state.actualjson)),
          shiftvolume: startingarray(this.workUnitList),
          finalvolume: startingarray(this.finalprogressList),
          sourcejson: startjson,
          finaljson: JSON.stringify(this.finalprogressList),
          TotalVolumes: TotalVolume,
          PilotVolume: PilotVolume,
          OpenPhaseVolume: TotalVolume - PilotVolume,
          OpenPhasePoint: OpenPhasePoint3,
          DrillPoints: DrillPoints3,
          ContractPoints: ContractPoints3,
          shiftVolumeDisplay: shiftvolume3
        });
        break;
      default:
        break;
    }
  };

  onSaveSnapShot = () => {
    const updatedState = { ...this.state };
    delete updatedState.snapShots;
    this.state.snapShots.push({ id: this.create_UUID(), info: updatedState });
    this.setState({ ...this.state }, () => {
      this.setState(
        {
          ...this.state,
          actualjson: this.state.finaljson,
          sourcejson: DataSource.ShiftWorkUnitsBlanks
        },
        () => {
          this.calculateFinalProgress(1);
        }
      );
    });
  };

  getSnapShot = obj => {
    const target = this.state.snapShots.filter(snap => obj.id === snap.id)[0];
    const snapshots = JSON.parse(JSON.stringify(this.state.snapShots));
    let updatedState = target.info;
    updatedState["snapShots"] = snapshots;
    this.setState(updatedState);
  };

  create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = "xxxx".replace(/[xy]/g, function(c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  onUndo = () => {
    const updatedstate = { ...this.state };
    updatedstate.snapShots.pop();
    this.setState(updatedstate, () => {
      if (this.state.snapShots.length - 1 != -1) {
        this.getSnapShot(this.state.snapShots[this.state.snapShots.length - 1]);
      } else {
        alert("All Snapshots are empty");
      }
    });
  };
  onClearPlan = () => {
    this.setState({
      ...this.state,
      DrillWeight: 0,
      openPhaseWeight: 0,
      drillPlan: `{ diameter: 0, distance: 0 }`,
      PilotPlan: `{ diameter: 0, distance: 0 }`
    });
  };

  onClearSegments = () => {
    this.setState({
      ...this.state,
      sourcejson: DataSource.ShiftWorkUnitsForClear,
      actualjson: DataSource.ActualArrayForClear,
      finaljson: "",
      snapShots: [],
      TotalVolumes: 0,
      PilotVolume: 0,
      OpenPhaseVolume: 0,
      actualvolume: 0,
      finalvolume: 0,
      shiftVolumeDisplay: 0,
      OpenPhasePoint: 0,
      DrillPoints: 0,
      ContractPoints: 0
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="main_container">
          <div className="App container_info left-side">
            <div>
              RESULTS
              {this.state.snapShots.map(snap => (
                <div
                  style={{ color: "blue", cursor: "pointer" }}
                  key={snap.id}
                  onClick={() => this.getSnapShot(snap)}
                >
                  {snap.id}
                </div>
              ))}
            </div>
            <div className="nav-button">
              <button onClick={() => this.onUndo()}>UNDO</button>
              <br />
              <button onClick={() => this.onClearSegments()}>
                CLEAR SEGMENTS
              </button>
              <br />
              <button>SUMMARY</button>
            </div>
          </div>
          <div className="App container_info right-side">
            <div className="header-title">
              Open Phase Segment & Volume Calculator
              <div>
                <button onClick={() => this.onClearPlan()}>CLEAR ALL</button>
              </div>
            </div>

            <div className="container_json first_row">
              <div>
                <span>Drill Plan : </span>
                <input
                  type="text"
                  onKeyPress={e => this.onDrillPlanKeyPress(e)}
                  onChange={e => {
                    this.onDrillPlan(e);
                  }}
                  value={this.state.drillPlan}
                />
              </div>
              <div style={{ marginLeft: "-145px" }}>
                Total Volume :
                {this.state.TotalVolumes.toFixed(DataSource.DECIMAL_POINTS)}
              </div>
              <div>
                <span>Open Phase Weight : </span>
                <input
                  id="openphaseweight"
                  type="text"
                  onChange={e => {
                    this.onOpenPhaseWeight(e);
                  }}
                  value={this.state.openPhaseWeight}
                />
              </div>
            </div>

            <div className="container_json first_row">
              <div>
                <span>Pilot Plan : </span>
                <input
                  type="text"
                  onChange={e => {
                    this.onPilotPlan(e);
                  }}
                  value={this.state.PilotPlan}
                />
              </div>
              <span style={{ marginLeft: "-210px" }}>
                Pilot Volume :
                {this.state.PilotVolume.toFixed(DataSource.DECIMAL_POINTS)}
              </span>
              <div>
                <span>Drill Weight : </span>
                <input
                  type="text"
                  style={{ width: "40px" }}
                  onChange={e => {
                    this.onDrillWeight(e);
                  }}
                  value={this.state.DrillWeight}
                />
              </div>
            </div>
            <div style={{ margin: "5px" }}>
              Open Phase Volume :
              {this.state.OpenPhaseVolume.toFixed(DataSource.DECIMAL_POINTS)}
            </div>
            <div className="container_json second-row">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Starting ProgressArray :</span>
                <textarea
                  onKeyPress={e => this.onActualChange(e)}
                  onChange={e => this.onActualChangeUser(e)}
                  value={this.state.actualjson}
                  className="textarea_target"
                />
              </div>
              <span>
                Starting Volume:
                {this.state.actualvolume.toFixed(DataSource.DECIMAL_POINTS)}
              </span>
            </div>
            <div className="container_json second-row">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Shift WorkUnits:</span>
                <textarea
                  style={{ marginLeft: "55px" }}
                  onKeyPress={ev => this.onSourceChange(ev)}
                  onChange={ev => this.onSourceChangeUser(ev)}
                  value={this.state.sourcejson}
                  className="textarea_source"
                />
              </div>
            </div>
            <div className="container_json second-row">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Ending ProgressArray :</span>
                <textarea
                  readOnly
                  style={{ marginLeft: "10px" }}
                  value={this.state.finaljson}
                  className="textarea_target"
                />
              </div>
              <span>
                Ending Volume:
                {this.state.finalvolume.toFixed(DataSource.DECIMAL_POINTS)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <div className="container_button">
                <button onClick={() => this.onSaveSnapShot()}>
                  SAVE RESULTS
                </button>
              </div>
              <div style={{ textAlign: "left", padding: "15px" }}>
                <div className="container_center">
                  <span>
                    Shift Volume:{" "}
                    {this.state.shiftVolumeDisplay.toFixed(
                      DataSource.DECIMAL_POINTS
                    )}
                  </span>
                </div>
                <div className="container_center">
                  <span>
                    Open Phase Points:{" "}
                    {this.state.OpenPhasePoint.toFixed(
                      DataSource.DECIMAL_POINTS
                    )}
                  </span>
                </div>
                <div className="container_center">
                  <span>
                    Drill Points:{" "}
                    {this.state.DrillPoints.toFixed(DataSource.DECIMAL_POINTS)}
                  </span>
                </div>
                <div className="container_center">
                  <span>
                    Contract Points:{" "}
                    {this.state.ContractPoints.toFixed(
                      DataSource.DECIMAL_POINTS
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
