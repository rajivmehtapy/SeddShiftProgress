import React, { Component } from "react";
import { Modal, Table } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import seddCalculation from "./utility/seddCalculation";
import DataSource from "./data/phaseDetail";
import { fromProgressArray, toArray, toVolume } from "@sedd/utils/segment";

const calculate = progress => toVolume(fromProgressArray(progress));
const startingarray = progress => toVolume(fromProgressArray(progress));
const finalarray = progress => toVolume(fromProgressArray(progress));

class phaseCalculation extends Component {
  state = {
    sourcejson: DataSource.ShiftWorkUnitsForClear,
    targetjson: DataSource.TargetInfo,
    actualjson: DataSource.ActualArray,
    finaljson: "",
    actualvolume: 0,
    finalvolume: 0,
    shiftvolume: 0,
    drillPlan: `{"diameter":0,"distance":0}`,
    openPhaseWeight: 0,
    PilotPlan: `{"diameter":0,"distance":0}`,
    DrillWeight: 0,
    OpenPhasePoint: 0,
    DrillPoints: 0,
    ContractPoints: 0,
    TotalVolumes: 0,
    PilotVolume: 0,
    OpenPhaseVolume: 0,
    shiftVolumeDisplay: 0,
    visible: false,
    phasePointsCumulative: 0,
    snapShots: []
  };

  columns = [
    {
      title: "Id",
      dataIndex: "Id",
      key: "Id"
    },
    {
      title: "volume",
      dataIndex: "shiftvolume",
      key: "shiftvolume",
      render: shiftvolume => shiftvolume.toFixed(DataSource.DECIMAL_POINTS)
    },
    {
      title: "PhasePoints",
      dataIndex: "OpenPhasePoint",
      key: "OpenPhasePoint",
      render: OpenPhasePoint =>
        OpenPhasePoint.toFixed(DataSource.DECIMAL_POINTS)
    },
    {
      title: "DrillPoints",
      dataIndex: "DrillPoints",
      key: "DrillPoints",
      render: DrillPoints => DrillPoints.toFixed(DataSource.DECIMAL_POINTS)
    },
    {
      title: "ContractPoints",
      dataIndex: "ContractPoints",
      key: "ContractPoints",
      render: ContractPoints =>
        ContractPoints.toFixed(DataSource.DECIMAL_POINTS)
    },
    {
      title: "phaseCompletion",
      dataIndex: "phasePointsCumulative",
      key: "phasePointsCumulative",
      render: phasePointsCumulative =>
        phasePointsCumulative.toFixed(DataSource.DECIMAL_POINTS)
    }
  ];

  gdata = [];
  seddCalculationRef = new seddCalculation();
  workUnitList = [];
  finalprogressList = [];
  volume = 0;
  phasepoints = 0;
  drillpoints = 0;
  ContractPoints = 0;

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

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
    try {
      JSON.stringify(e.currentTarget.value);
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
    } catch (error) {}
  };

  onDrillPlan = e => {
    try {
      JSON.parse(e.currentTarget.value);
      this.setState({ ...this.state, drillPlan: e.currentTarget.value });
    } catch (error) {}
  };

  onOpenPhaseWeight = e => {
    try {
      JSON.parse(e.currentTarget.value);
      this.setState(
        { ...this.state, openPhaseWeight: e.currentTarget.value },
        () => {
          this.calculateFinalProgress(2, this.state.actualjson);
        }
      );
    } catch (error) {}
  };

  onPilotPlanKeyPress = e => {
    try {
      JSON.stringify(e.currentTarget.value);
      if (e.key === "Enter") {
        var actualjson = JSON.parse(this.state.actualjson);
        actualjson[0] = JSON.parse(e.currentTarget.value);
        //console.log(this.state.sourcejson);
        this.setState(
          {
            ...this.state,
            PilotPlan: e.currentTarget.value,
            actualjson: JSON.stringify(actualjson)
          },
          () => {
            this.calculateFinalProgress(2, this.state.actualjson);
          }
        );
      }
    } catch (error) {
      alert("error");
    }
  };

  onPilotPlan = e => {
    this.setState({ ...this.state, PilotPlan: e.currentTarget.value });
    // try {
    //   JSON.parse(e.currentTarget.value);
    //   this.setState({ ...this.state, PilotPlan: e.currentTarget.value });
    // } catch (error) {}
  };

  onDrillWeight = e => {
    try {
      JSON.parse(e.currentTarget.value);
      this.setState(
        { ...this.state, DrillWeight: e.currentTarget.value },
        () => {
          this.calculateFinalProgress(2, this.state.actualjson);
        }
      );
    } catch (error) {}
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
        let OpenPhasePoint = shiftvolume / (TotalVolume - PilotVolume);
        let DrillPoints = OpenPhasePoint * (this.state.openPhaseWeight / 100);
        let ContractPoints = DrillPoints * (this.state.DrillWeight / 100);
        let phasePointsCumulative =
          startingarray(this.finalprogressList) / (TotalVolume - PilotVolume);
        OpenPhasePoint = isNaN(OpenPhasePoint) ? 0 : OpenPhasePoint;
        DrillPoints = isNaN(DrillPoints) ? 0 : DrillPoints;
        ContractPoints = isNaN(ContractPoints) ? 0 : ContractPoints;
        if (startingarray(JSON.parse(this.state.sourcejson)) === 0) {
          phasePointsCumulative = 0;
        } else {
          phasePointsCumulative = isNaN(phasePointsCumulative)
            ? 0
            : phasePointsCumulative;
        }
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
          phasePointsCumulative: phasePointsCumulative,
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
        let phasePointsCumulativeRef =
          startingarray(JSON.parse(this.state.sourcejson)) !== 0
            ? startingarray(this.finalprogressList) /
              (TotalVolume - PilotVolume)
            : 0;
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
          phasePointsCumulative: phasePointsCumulativeRef,
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
          phasePointsCumulative:
            startingarray(this.finalprogressList) / (TotalVolume - PilotVolume),
          shiftVolumeDisplay: shiftvolume3
        });
        break;
      default:
        break;
    }
  };

  volume = 0;
  phasepoints = 0;
  drillpoints = 0;
  ContractPoints = 0;

  calculateSummary = () => {
    this.volume = 0;
    this.phasepoints = 0;
    this.drillpoints = 0;
    this.ContractPoints = 0;
    this.gdata.map(item => {
      this.volume += item.shiftvolume;
      this.phasepoints += item.OpenPhasePoint;
      this.drillpoints += item.DrillPoints;
      this.ContractPoints += item.ContractPoints;
    });
  };
  onSaveSnapShot = () => {
    const updatedState = { ...this.state };
    delete updatedState.snapShots;
    const resultObj = { id: this.create_UUID(), info: updatedState };
    this.state.snapShots.push(resultObj);
    this.gdata.push({
      key: resultObj.id,
      Id: resultObj.id,
      shiftvolume: resultObj.info.shiftVolumeDisplay,
      OpenPhasePoint: resultObj.info.OpenPhasePoint,
      DrillPoints: resultObj.info.DrillPoints,
      ContractPoints: resultObj.info.ContractPoints,
      phasePointsCumulative: resultObj.info.phasePointsCumulative
    });
    this.calculateSummary();
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
    this.gdata.pop();
    this.setState(updatedstate, () => {
      if (this.state.snapShots.length - 1 != -1) {
        this.getSnapShot(this.state.snapShots[this.state.snapShots.length - 1]);
        this.calculateSummary();
      } else {
        alert("All Snapshots are empty");
      }
    });
  };

  onClearPlan = () => {
    this.setState(
      {
        ...this.state,
        DrillWeight: 0,
        openPhaseWeight: 0,
        snapShots: [],
        drillPlan: `{ "diameter": 0, "distance": 0 }`,
        PilotPlan: `{ "diameter": 0, "distance": 0 }`
      },
      () => {
        this.onClearSegments();
      }
    );
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
      phasePointsCumulative: 0,
      ContractPoints: 0
    });
    this.ResetSummary();
  };

  ResetSummary = () => {
    this.gdata = [];
    this.volume = 0;
    this.phasepoints = 0;
    this.drillpoints = 0;
    this.ContractPoints = 0;
  };

  convertToTitle = () => {
    try {
      const title = `${JSON.parse(this.state.drillPlan).diameter} x ${
        JSON.parse(this.state.drillPlan).distance
      } with Pilot ${JSON.parse(this.state.PilotPlan).diameter} x ${
        JSON.parse(this.state.PilotPlan).distance
      }`;
      return title;
    } catch (error) {
      return "";
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="main_container">
          <div className="App container_info left-side">
            {/* <div>RESULTS -- {version}</div> */}
            <div className="nav-button">
              <button
                style={{ fontSize: "11px" }}
                onClick={() => this.onUndo()}
              >
                UNDO
              </button>
              <br />
              <button
                style={{ fontSize: "11px" }}
                onClick={() => this.onClearSegments()}
              >
                CLEAR SEGMENTS
              </button>
              <br />
              <button style={{ fontSize: "11px" }} onClick={this.showModal}>
                SUMMARY
              </button>
              <Modal
                width="100"
                title={this.convertToTitle()}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okButtonProps={{ disabled: false }}
                cancelButtonProps={{ disabled: false }}
              >
                <Table
                  pagination={false}
                  columns={this.columns}
                  dataSource={this.gdata}
                />
                <div className="dlg-table">
                  <div style={{ marginLeft: "150px" }}>
                    {this.volume.toFixed(DataSource.DECIMAL_POINTS)}
                  </div>
                  <div style={{ marginLeft: "125px" }}>
                    {this.phasepoints.toFixed(DataSource.DECIMAL_POINTS)}
                  </div>
                  <div style={{ marginLeft: "195px" }}>
                    {this.drillpoints.toFixed(DataSource.DECIMAL_POINTS)}
                  </div>
                  <div style={{ marginLeft: "152px" }}>
                    {this.ContractPoints.toFixed(DataSource.DECIMAL_POINTS)}
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <div className="App container_info right-side">
            <div className="header-title">
              Open Phase Segment & Volume Calculator
              <div>
                <button
                  style={{ fontSize: "11px" }}
                  onClick={() => this.onClearPlan()}
                >
                  CLEAR ALL
                </button>
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
                  onKeyPress={e => this.onPilotPlanKeyPress(e)}
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
                  style={{ marginLeft: "12px" }}
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
                <button
                  style={{ fontSize: "11px" }}
                  onClick={() => this.onSaveSnapShot()}
                >
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
                    Phase Completion:{" "}
                    {this.state.phasePointsCumulative.toFixed(
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

export default phaseCalculation;
