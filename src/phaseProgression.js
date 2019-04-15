/* eslint-disable no-extend-native */
import React, { Component } from "react";
import "antd/dist/antd.css";
import "./App.css";
import DataSource from "./data/phaseDetail";
import { Table, DatePicker, TimePicker, Select, Modal } from "antd";
import moment from "moment";
import * as _ from "lodash";
import ProgressDetail from "./utility/ProgressDetail";
import { fromProgressArray, toArray, toVolume } from "@sedd/utils/segment";

const calculate = progress => toVolume(fromProgressArray(progress));

const Option = Select.Option;

String.prototype.toHHMMSS = function() {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes;
};

class PhaseProgression extends Component {
  state = {
    DrillPlan: DataSource.DRILL_PLAN,
    PilotPlan: DataSource.PILOT_PLAN,
    PhaseSteps: DataSource.PHASE_STEPS,
    shiftStatus: DataSource.SHIFT_STATUS_DATA,
    disabledmode: false,
    currentPhase: 1,
    visible: false,
    visiblePrior: false,
    disabledmodesummary: true,
    PhaseStartTime: moment(new Date()),
    PhaseStartDate: moment(new Date()),
    phaseProgress: []
  };
  columns = [
    {
      title: "Phasse Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "start Time",
      dataIndex: "startTime",
      key: "startTime"
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime"
    },
    {
      title: "Hours",
      dataIndex: "Hours",
      key: "Hours"
    }
  ];

  history = {
    keys: [],
    phaseProgress: []
  };

  phaseProgressObj = {
    Index: 0,
    CurrentPhaseID: 0,
    CurrentPhaseTitle: "",
    WasPhaseCompleted: false,
    PhaseStartTime: null,
    PhaseEndTime: null,
    Hours: 0,
    type: -1,
    PhaseData: {
      completion: 0,
      workunit: [
        {
          diameter: 0,
          distance: 0
        }
      ]
    },
    NextIsStartedDuringShift: false,
    NextPhaseIndex: 0,
    WasPhaseCompletedIndex: "1",
    NextIsStartedDuringShiftIndex: "1"
  };

  handleChange = value => {
    this.setState({ ...this.state, currentPhase: value });
  };

  onResetProgress = () => {
    if (_.isNull(localStorage.getItem("history"))) {
      return;
    }
    this.setState(
      {
        ...this.state,
        disabledmode: false,
        disabledmodesummary: true,
        currentPhase: 1,
        PhaseStartTime: moment(new Date()),
        PhaseStartDate: moment(new Date()),
        phaseProgress: []
      },
      () => {
        JSON.parse(localStorage.getItem("history")).keys.map(key => {
          localStorage.removeItem(key);
        });
        localStorage.removeItem("history");
      }
    );
  };

  onSaveProgress = () => {
    const phaseProgressObj = _.clone(this.phaseProgressObj);
    const currentPhaseDetail = this.state.PhaseSteps.filter(
      item => item.id === this.state.currentPhase
    )[0];
    //Task #1:Here we need to set Start time in case of date chage.
    phaseProgressObj.PhaseStartTime = this.state.PhaseStartTime;
    phaseProgressObj.Index = this.state.phaseProgress.length;
    phaseProgressObj.CurrentPhaseID = currentPhaseDetail.id;
    phaseProgressObj.CurrentPhaseTitle = currentPhaseDetail.title;
    phaseProgressObj.type = currentPhaseDetail.type;
    phaseProgressObj.NextPhaseIndex = currentPhaseDetail.nextid;
    this.state.phaseProgress.push(phaseProgressObj);
    this.setState({
      ...this.state,
      disabledmode: true,
      phaseProgress: this.state.phaseProgress
    });
  };
  onRemovePhase = value => {
    let updatedState = { ...this.state };
    _.remove(updatedState.phaseProgress, {
      CurrentPhaseID: value
    });
    this.setState({
      ...this.state,
      phaseProgress: this.state.phaseProgress
    });
  };
  onChangePhase = (value, PhaseStartTime) => {
    this.setState(
      { ...this.state, currentPhase: value, disabledmodesummary: false },
      () => {
        const phaseProgressObj = JSON.parse(
          JSON.stringify(this.phaseProgressObj)
        );
        phaseProgressObj.PhaseData.completion = 0;

        phaseProgressObj.PhaseData.workunit[0] = {
          diameter: 0,
          distance: 0
        };

        const currentPhaseDetail = this.state.PhaseSteps.filter(
          item => item.id === this.state.currentPhase
        )[0];
        phaseProgressObj.PhaseStartTime = PhaseStartTime;
        phaseProgressObj.Index = this.state.phaseProgress.length;
        phaseProgressObj.CurrentPhaseID = currentPhaseDetail.id;
        phaseProgressObj.CurrentPhaseTitle = currentPhaseDetail.title;
        phaseProgressObj.type = currentPhaseDetail.type;
        phaseProgressObj.NextPhaseIndex = currentPhaseDetail.nextid;
        const index = _.findIndex(this.state.phaseProgress, {
          CurrentPhaseID: currentPhaseDetail.id
        });
        if (index === -1) {
          this.state.phaseProgress.push(phaseProgressObj);
        } else {
          this.state.phaseProgress[index] = phaseProgressObj;
        }

        this.setState({
          ...this.state,
          phaseProgress: this.state.phaseProgress
        });
      }
    );
  };

  onChangeTime = value => {
    this.state.phaseProgress.map((phase, index) => {
      if (index === this.state.phaseProgress.length - 1) {
        phase.PhaseStartTime = value;
      }
    });
    this.setState({ ...this.state, PhaseStartTime: value });
  };
  onChangeDate = value => {
    this.loadDataFromStorage(value, true);
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  saveStatus = () => {
    const updatedState = this.updateStateInfo(true);
    const key = moment(this.state.PhaseStartDate).format("MM-DD-YYYY");
    localStorage.setItem(key, JSON.stringify(updatedState));
  };
  updateStateInfo = isShowData => {
    const updatedState = { ...this.state };
    updatedState.visiblePrior = isShowData;
    const shiftStatus = updatedState.shiftStatus;
    shiftStatus.currentPhaseProgressType =
      this.state.phaseProgress[this.state.phaseProgress.length - 1].type === 0
        ? "NON-DRILL"
        : "DRILL";
    shiftStatus.currentPhasePercentComplete = this.state.phaseProgress[
      this.state.phaseProgress.length - 1
    ].PhaseData.completion;
    shiftStatus.currentPhaseType = this.state.phaseProgress[
      this.state.phaseProgress.length - 1
    ].CurrentPhaseTitle;
    shiftStatus.dateStart = this.state.PhaseStartDate.format("MM/DD/YYYY");
    shiftStatus.drillOpenPlan = this.state.DrillPlan;
    shiftStatus.drillPilotPlan = this.state.PilotPlan;
    this.state.phaseProgress.map(phaseItem => {
      const shiftDetail =
        shiftStatus.drillPhaseStatus[phaseItem.CurrentPhaseTitle];

      shiftDetail.isComplete = phaseItem.WasPhaseCompleted;
      shiftDetail.phaseId = phaseItem.CurrentPhaseID;
      shiftDetail.phaseIndex = phaseItem.Index;
      shiftDetail.phaseType = phaseItem.type === 0 ? "NON-DRILL" : "DRILL";
      shiftDetail.phaseWeight = this.state.PhaseSteps.filter(
        item => item.id === phaseItem.CurrentPhaseID
      )[0].phaseWeight;
      if (phaseItem.type !== 0) {
        shiftDetail.percentComplete = this.getPercentComplete(phaseItem);
        shiftDetail.segment = this.getSegment(phaseItem);
        shiftDetail.volume = this.getVolume(phaseItem);
      } else {
        shiftDetail.percentComplete = phaseItem.PhaseData.completion;
      }
      //====Save History in Local Object================
      this.history = _.isNull(localStorage.getItem("history"))
        ? this.history
        : JSON.parse(localStorage.getItem("history"));
      const key = moment(this.state.PhaseStartDate).format("MM-DD-YYYY");
      this.history.keys.push(key);
      const historyitem = JSON.parse(JSON.stringify(phaseItem));
      historyitem["key"] = key;
      this.history.phaseProgress.push(historyitem);
      const obj = _.uniqBy(this.history.phaseProgress, e => {
        return e.CurrentPhaseID && e.key;
      });
      this.history.phaseProgress = obj;
      localStorage.setItem("history", JSON.stringify(this.history));
      //==============================================================================
    });

    return updatedState;
  };

  showModalForShiftStatus = () => {
    const updatedState = this.updateStateInfo(true);
    this.setState(updatedState, () => {});
  };
  finalProgressList = {};

  getOpenPhasePoint = phaseItem => {
    let percentComplete = 0;
    switch (phaseItem.CurrentPhaseID) {
      case 3:
        //Apply fix for Drill point
        let workunit = [];
        let startProgress = {};
        if (!_.isEmpty(this.finalProgressList)) {
          startProgress = JSON.parse(JSON.stringify(this.finalProgressList));
        } else {
          startProgress = _.clone(DataSource.PILOT_PLAN);
        }
        let targetVolume = _.clone(DataSource.DRILL_PLAN);
        let pilotplan = _.clone(DataSource.PILOT_PLAN);

        phaseItem.PhaseData.workunit.map(unit => {
          const unitRef = JSON.parse(JSON.stringify(unit));
          workunit.push({
            diameter: Number(unitRef.diameter),
            distance: unitRef.distance
          });
        });

        this.finalProgressList = toArray(
          fromProgressArray([startProgress].concat(workunit))
        );
        console.log(this.finalProgressList);
        let OpenPhasePoint =
          this.getVolume(phaseItem) /
          (calculate([targetVolume]) - calculate([pilotplan]));

        if (workunit[0].diameter !== 0 && workunit[0].distance !== 0) {
          percentComplete = OpenPhasePoint.toFixed(4);
        } else {
          percentComplete = 0;
        }
        break;
      default:
        break;
    }
    return percentComplete;
  };

  getPercentComplete = phaseItem => {
    let percentComplete = 0;
    switch (phaseItem.CurrentPhaseID) {
      case 2:
        percentComplete = (
          phaseItem.PhaseData.workunit[0].distance /
          this.state.PilotPlan.distance
        ).toFixed(4);
        break;
      case 3:
        let workunit = [];
        let startProgress = _.clone(DataSource.PILOT_PLAN);
        let targetVolume = _.clone(DataSource.DRILL_PLAN);
        let pilotplan = _.clone(DataSource.PILOT_PLAN);

        phaseItem.PhaseData.workunit.map(unit => {
          const unitRef = JSON.parse(JSON.stringify(unit));
          workunit.push({
            diameter: Number(unitRef.diameter),
            distance: unitRef.distance
          });
        });
        let finalProgressList = toArray(
          fromProgressArray([startProgress].concat(workunit))
        );
        let gd =
          calculate(finalProgressList) /
          (calculate([targetVolume]) - calculate([pilotplan]));

        if (workunit[0].diameter !== 0 && workunit[0].distance !== 0) {
          percentComplete = gd.toFixed(4);
        } else {
          percentComplete = 0;
        }
        break;
      default:
        break;
    }
    return percentComplete;
  };

  getSegment = phaseItem => {
    let Segment = "";
    switch (phaseItem.CurrentPhaseID) {
      case 2:
        Segment = `${phaseItem.PhaseData.workunit[0].diameter}x${
          phaseItem.PhaseData.workunit[0].distance
        },0X${this.state.DrillPlan.distance -
          phaseItem.PhaseData.workunit[0].distance} `;
        break;
      case 3:
        Segment = "";
        let totaldistance = 0;
        let workunit = [];
        let startProgress = _.clone(DataSource.PILOT_PLAN);

        phaseItem.PhaseData.workunit.map(unit => {
          const unitRef = JSON.parse(JSON.stringify(unit));
          workunit.push({
            diameter: Number(unitRef.diameter),
            distance: unitRef.distance
          });
        });
        let finalProgressList = toArray(
          fromProgressArray([startProgress].concat(workunit))
        );

        finalProgressList.map(unit => {
          totaldistance += unit.distance;
          Segment += `${unit.diameter}x${unit.distance},`;
        });
        break;
      default:
        break;
    }
    return Segment;
  };

  getVolume = phaseItem => {
    let Volume = 0;
    switch (phaseItem.CurrentPhaseID) {
      case 2:
        Volume = calculate(
          toArray(fromProgressArray(phaseItem.PhaseData.workunit))
        ).toFixed(4);
        break;
      case 3:
        let workunit = [];
        let startProgress = _.clone(DataSource.PILOT_PLAN);
        let startProgress2 = _.clone(DataSource.PILOT_PLAN);
        phaseItem.PhaseData.workunit.map(unit => {
          workunit.push({
            diameter: Number(unit.diameter),
            distance: unit.distance
          });
        });
        let finalProgressList = toArray(
          fromProgressArray([startProgress].concat(workunit))
        );
        const shiftvolume3 =
          calculate(finalProgressList) - calculate([startProgress2]);
        Volume = shiftvolume3.toFixed(4);
        break;
      default:
        break;
    }
    return Volume;
  };

  componentDidMount() {
    try {
      this.loadDataFromStorage(moment(new Date()), false);
    } catch (error) {}
  }

  loadDataFromStorage(dateRef, isFromDateChage) {
    const key = dateRef.format("MM-DD-YYYY");
    const localdata = JSON.parse(localStorage.getItem(key));

    const updatedState = { ...this.state };
    if (!_.isNull(localdata)) {
      localdata.phaseProgress.map((phase, index) => {
        if (index === localdata.phaseProgress.length - 1) {
          phase.PhaseStartTime = moment(localdata.PhaseStartDate);
        } else {
          phase.PhaseStartTime = moment(phase.PhaseStartTime);
        }

        phase.PhaseEndTime = moment(phase.PhaseEndTime);
      });
      updatedState.disabledmode = true;
      updatedState.phaseProgress = localdata.phaseProgress;
      updatedState.PhaseStartTime = moment(localdata.PhaseStartDate);
      updatedState.PhaseStartDate = moment(localdata.PhaseStartTime);
      updatedState.currentPhase =
        updatedState.phaseProgress[
          updatedState.phaseProgress.length - 1
        ].CurrentPhaseID;
    } else {
      isFromDateChage
        ? (updatedState.disabledmode = true)
        : (updatedState.disabledmode = false);
    }
    updatedState.PhaseStartDate = dateRef;
    this.setState(updatedState);
  }

  hideModal = () => {
    this.setState({
      visible: false,
      visiblePrior: false
    });
  };

  onSummaryRef = () => {
    this.setState({ disabledmodesummary: false });
    this.showModal();
  };

  calculateEndTime(phaseDetails) {
    if (phaseDetails.phaseProgress.length !== 0) {
      return moment(
        phaseDetails.phaseProgress[phaseDetails.phaseProgress.length - 1]
          .PhaseEndTime
      ).format("HH:mm");
    } else {
      return "00:00";
    }
  }

  calculateHours(phaseDetails) {
    try {
      const second = String(
        phaseDetails.phaseProgress[
          phaseDetails.phaseProgress.length - 1
        ].PhaseEndTime.diff(
          phaseDetails.phaseProgress[0].PhaseStartTime,
          "seconds",
          false
        )
      );
      return second.toHHMMSS();
    } catch (error) {}
  }

  convertToTable(phaseDetails) {
    let gdb = [];
    phaseDetails.phaseProgress.map(phase => {
      gdb.push({
        key: phase.CurrentPhaseID,
        name: this.state.PhaseSteps.filter(
          item => item.id === phase.CurrentPhaseID
        )[0].title,
        startTime: moment(phase.PhaseStartTime).format("HH:mm"),
        endTime: moment(phase.PhaseEndTime).format("HH:mm"),
        Hours: phase.Hours
      });
    });
    return gdb;
  }

  calculatetime(StartTime, EndTime) {
    StartTime = moment(StartTime).format("hh:mm:ss a");
    EndTime = moment(EndTime).format("hh:mm:ss a");

    var startTime = moment(StartTime, "hh:mm:ss a");
    var endTime = moment(EndTime, "hh:mm:ss a");

    var mins = moment
      .utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss")))
      .format("mm");

    let TotalHours = endTime.diff(startTime, "hours") + ":" + mins;
    return TotalHours;
  }

  RenderData = () => {
    return JSON.stringify(this.state.shiftStatus);
  };

  render() {
    return (
      <div>
        <div className="steps-content">
          <div>
            <div className="progress-container">
              <div className="progress-container-row">
                <span>Date:</span>
                <DatePicker
                  onChange={this.onChangeDate}
                  value={this.state.PhaseStartDate}
                  placeholder="Select Start Date"
                />
              </div>
              <div className="progress-container-row">
                <span>Starting Phase:</span>
                <Select
                  disabled={this.state.disabledmode}
                  value={this.state.currentPhase}
                  style={{ width: 120 }}
                  onChange={value => this.handleChange(value)}
                >
                  {this.state.PhaseSteps.map(phase => {
                    return (
                      <Option value={phase.id} key={phase.id}>
                        {phase.title}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div className="progress-container-row">
                <span>Start Time:</span>
                <div className="progress-time">
                  <TimePicker
                    onChange={value => this.onChangeTime(value)}
                    format="HH:mm"
                    value={this.state.PhaseStartTime}
                  />
                </div>
              </div>
              <div>
                <button
                  disabled={this.state.disabledmode}
                  onClick={() => this.onSaveProgress()}
                >
                  Start Phase
                </button>
                <button onClick={() => this.onResetProgress()}>Reset</button>
                <button onClick={() => this.showModal()}>Show Summary</button>
                <button onClick={() => this.showModalForShiftStatus()}>
                  Shift Status
                </button>
                <button onClick={() => this.saveStatus()}>save Status</button>
              </div>
            </div>

            <div>
              {this.state.phaseProgress.map((phase, index) => {
                return (
                  <div key={index}>
                    <ProgressDetail
                      dateRef={this.state.PhaseStartDate}
                      RemovePhase={value => {
                        this.onRemovePhase(value);
                      }}
                      onNextPhase={(value, starttime) =>
                        this.onChangePhase(value, starttime)
                      }
                      onSummary={() => this.onSummaryRef()}
                      phaseDetail={phase}
                      GetVolume={phaseItem => this.getVolume(phaseItem)}
                      GetSegment={phaseItem => this.getSegment(phaseItem)}
                      GetPercentageInfo={phaseItem =>
                        this.getPercentComplete(phaseItem)
                      }
                      GetOpenPhasePoints={phaseItem =>
                        this.getOpenPhasePoint(phaseItem)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <Modal
            width="100"
            title="SHIFT SUMMARY"
            visible={this.state.visible}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            okText="Ok"
            cancelText="Cancel"
          >
            <div>
              <div>
                <div>
                  <span>Date:</span>
                  <span>{this.state.PhaseStartDate.format("MM/DD/YYYY")}</span>
                </div>
                <div>
                  <span>Shift Start Time:</span>
                  <span>{this.state.PhaseStartTime.format("HH:mm")}</span>
                </div>
                <div>
                  <span>Shift End Time:</span>
                  <span>{this.calculateEndTime(this.state)}</span>
                </div>
                <div>
                  <span>Shift Hours:</span>
                  <span>{this.calculateHours(this.state)}</span>
                </div>
              </div>
              <div>
                <Table
                  pagination={false}
                  columns={this.columns}
                  dataSource={this.convertToTable(this.state)}
                />
              </div>
            </div>
          </Modal>

          <Modal
            title="Prior Object"
            visible={this.state.visiblePrior}
            onOk={this.hideModal}
            onCancel={this.hideModal}
          >
            <p>Data: {this.RenderData()}</p>
          </Modal>
        </div>
      </div>
    );
  }
}

export default PhaseProgression;
