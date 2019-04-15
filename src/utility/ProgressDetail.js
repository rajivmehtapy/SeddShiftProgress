/* eslint-disable no-redeclare */
import React, { Component } from "react";
import "antd/dist/antd.css";
import { InputNumber, TimePicker, message, Radio } from "antd";
import moment from "moment";
import * as _ from "lodash";
import "../App.css";
import DataSource from "../data/phaseDetail";
import ProgressCapture from "./ProgressCapture";
//import Checkbox from "react-three-state-checkbox";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class ProgressDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PhaseSteps: DataSource.PHASE_STEPS,
      indeterminate: true,
      phasePoints: 0,
      drillPoints: 0,
      segment: ""
    };
  }
  getPhase = nextPhaseID => {
    if (nextPhaseID === -1) {
      return `Was new drill started during shift?`;
    } else {
      const obj = this.state.PhaseSteps.filter(
        item => item.id === this.props.phaseDetail.NextPhaseIndex
      )[0];
      return `Was ${obj.title} Phase started during shift ?`;
    }
  };

  onChange = value => {
    const updatedState = { ...this.state };
    updatedState.phaseDetail.WasPhaseCompleted =
      value.target.value === "2" ? true : false;
    console.log(updatedState);
    this.setState(updatedState, () => {
      if (
        !this.state.phaseDetail.WasPhaseCompleted &&
        this.state.phaseDetail.NextPhaseIndex !== -1
      ) {
        this.props.RemovePhase(this.props.phaseDetail.NextPhaseIndex);
      }
      console.log(this.state.phaseDetail.PhaseData.completion);
    });

    this.props.phaseDetail.WasPhaseCompletedIndex = value.target.value;
  };

  onChangeForNextPhase = value => {
    this.state.phaseDetail.NextIsStartedDuringShift =
      value.target.value === "2" ? true : false;
    this.setState({ ...this.state }, () => {
      if (this.state.phaseDetail.NextPhaseIndex !== -1) {
        if (this.state.phaseDetail.NextIsStartedDuringShift) {
          // this.props.onNextPhase(
          //   this.state.phaseDetail.NextPhaseIndex,
          //   this.state.phaseDetail.PhaseEndTime
          // );

          if (this.state.phasePoints >= 1) {
            this.props.onNextPhase(
              this.state.phaseDetail.NextPhaseIndex,
              this.state.phaseDetail.PhaseEndTime
            );
          } else {
            message.error("Current phase is not finished yet");
          }
        } else {
          this.props.RemovePhase(this.props.phaseDetail.NextPhaseIndex);
        }
      } else {
        this.props.onSummary();
      }
      this.props.phaseDetail.NextIsStartedDuringShiftIndex = value.target.value;
    });
  };

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

  onChangeTime = value => {
    if (_.isNull(value)) {
      return;
    }
    this.state.phaseDetail.PhaseEndTime = value;
    this.setState({ ...this.state }, () => {
      const hours = this.calculatetime(
        this.state.phaseDetail.PhaseStartTime,
        this.state.phaseDetail.PhaseEndTime
      );
      this.state.phaseDetail.Hours = hours;
      message.success(`Shift Progress completed!`);
      this.setState({ ...this.state });
    });
  };

  getTitle = () => {
    return this.state.phaseDetail.WasPhaseCompleted
      ? `Phase EndTime:`
      : `Shift EndTime:`;
  };

  componentWillReceiveProps(nextProps) {
    this.history = localStorage.getItem("history");
    if (!_.isNull(this.history)) {
      const phaseProgress = JSON.parse(this.history).phaseProgress;
      const key = nextProps.dateRef.format("MM-DD-YYYY");
      const refkey = phaseProgress.filter(
        item =>
          item.key === key &&
          item.CurrentPhaseID == nextProps.phaseDetail.CurrentPhaseID
      );
      if (refkey.length !== 0) {
        nextProps.phaseDetail.PhaseData.completion =
          refkey[0].PhaseData.completion;
      } else {
        nextProps.phaseDetail.PhaseData.completion = 0;
      }
    }

    this.setState(
      {
        ...this.state,
        phaseDetail: nextProps.phaseDetail
      },
      this.applychanges
    );
  }
  history = {};
  componentWillMount() {
    this.history = localStorage.getItem("history");

    this.setState(
      {
        ...this.state,
        phaseDetail: this.props.phaseDetail
      },
      this.applychanges
    );
  }

  applychanges = () => {
    const updatedState = { ...this.state };

    switch (this.state.phaseDetail.CurrentPhaseID) {
      case 1:
        const phasePoints = this.calculatepercentage(
          this.props.phaseDetail.CurrentPhaseID
        );
        const drillPoints = this.calculatedrillpoints(
          this.props.phaseDetail.CurrentPhaseID,
          phasePoints
        );
        this.setState({
          ...this.state,
          phasePoints: phasePoints,
          drillPoints: drillPoints
        });
        if (Number(phasePoints) >= 1) {
          const phaseDetail = { ...this.state.phaseDetail };
          phaseDetail.PhaseData.completion = 100;
          this.setState({
            ...this.state,
            phaseDetail: phaseDetail
          });
        } else {
          this.setState({
            ...this.state,
            phasePoints: phasePoints,
            drillPoints: drillPoints
          });
        }
        break;
      case 4:
        const phasePoints4 = this.calculatepercentage(
          this.props.phaseDetail.CurrentPhaseID
        );
        const drillPoints4 = this.calculatedrillpoints(
          this.props.phaseDetail.CurrentPhaseID,
          phasePoints4
        );
        this.setState({
          ...this.state,
          phasePoints: phasePoints4,
          drillPoints: drillPoints4
        });
        break;

      case 2:
        updatedState.phasePoints = this.props.GetPercentageInfo(
          updatedState.phaseDetail
        );
        updatedState.segment = this.props.GetSegment(updatedState.phaseDetail);
        updatedState.drillPoints = this.calculatedrillpoints(
          updatedState.phaseDetail.CurrentPhaseID,
          updatedState.phasePoints
        );
        this.calculatedrillpoints();
        this.setState(updatedState);
        break;

      case 3:
        updatedState.phasePoints = this.props.GetPercentageInfo(
          updatedState.phaseDetail
        );
        updatedState.segment = this.props.GetSegment(updatedState.phaseDetail);
        // updatedState.drillPoints = this.calculatedrillpoints(
        //   updatedState.phaseDetail.CurrentPhaseID,
        //   updatedState.phasePoints
        // );
        //this.calculatedrillpoints();

        //==================

        // updatedState.phasePoints = this.props.GetPercentageInfo(
        //   updatedState.phaseDetail
        // );
        const openphasePoint = this.props.GetOpenPhasePoints(
          updatedState.phaseDetail
        );
        //updatedState.segment = this.props.GetSegment(updatedState.phaseDetail);
        updatedState.drillPoints = this.calculatedrillpoints(
          updatedState.phaseDetail.CurrentPhaseID,
          openphasePoint
        );
        //        this.setState(updatedState);

        //=================

        this.setState(updatedState);
        break;

      default:
        break;
    }
  };

  onChagecompletion(value) {
    const updatedState = { ...this.state };
    updatedState.phaseDetail.PhaseData.completion = value;
    updatedState.phasePoints = this.calculatepercentage(
      this.props.phaseDetail.CurrentPhaseID
    );
    updatedState.drillPoints = this.calculatedrillpoints(
      this.props.phaseDetail.CurrentPhaseID,
      updatedState.phasePoints
    );
    this.setState(updatedState);
  }

  calculatepercentage = mode => {
    let percentageComplete = 0;
    let totalpercentages = 0;

    switch (mode) {
      case 1:
        if (!_.isNull(this.history)) {
          const phaseProgress = JSON.parse(this.history).phaseProgress;
          phaseProgress.map(item => {
            totalpercentages += item.PhaseData.completion;
          });
          const key = this.props.dateRef.format("MM-DD-YYYY");
          const refkey = phaseProgress.filter(item => item.key === key);
          if (refkey.length !== 0) {
            percentageComplete = totalpercentages / 100;
          } else {
            percentageComplete =
              (totalpercentages + this.state.phaseDetail.PhaseData.completion) /
              100;
          }
        } else {
          percentageComplete =
            (totalpercentages + this.state.phaseDetail.PhaseData.completion) /
            100;
        }
        break;
      case 4:
        if (!_.isNull(this.history)) {
          const phaseProgress = JSON.parse(this.history).phaseProgress;
          phaseProgress.map(item => {
            totalpercentages += item.PhaseData.completion;
          });
          const key = this.props.dateRef.format("MM-DD-YYYY");
          const refkey = phaseProgress.filter(item => item.key === key);
          if (refkey.length !== 0) {
            percentageComplete = totalpercentages / 100;
          } else {
            percentageComplete =
              (totalpercentages + this.state.phaseDetail.PhaseData.completion) /
              100;
          }
        } else {
          percentageComplete =
            (totalpercentages + this.state.phaseDetail.PhaseData.completion) /
            100;
        }
        break;
      default:
        break;
    }
    return percentageComplete.toFixed(4);
  };

  calculatedrillpoints = (mode, phasePoints) => {
    if (_.isUndefined(mode)) {
      return;
    }
    let weight = this.state.PhaseSteps.filter(item => item.id === mode)[0]
      .phaseWeight;
    let drillPoints = 0;
    switch (mode) {
      case 1:
        drillPoints = phasePoints * (weight / 100);
        break;
      case 4:
        drillPoints = phasePoints * (weight / 100);
        break;
      case 2:
        drillPoints = phasePoints * (weight / 100);
        break;
      case 3:
        drillPoints = phasePoints * (weight / 100);
        break;

      default:
        break;
    }
    return drillPoints.toFixed(4);
  };

  onChangeInPilotPhase = workunit => {
    const updatedState = { ...this.state };
    updatedState.phaseDetail.PhaseData["workunit"] = workunit;
    switch (updatedState.phaseDetail.CurrentPhaseID) {
      case 2:
        updatedState.phasePoints = this.props.GetPercentageInfo(
          updatedState.phaseDetail
        );
        updatedState.segment = this.props.GetSegment(updatedState.phaseDetail);
        updatedState.drillPoints = this.calculatedrillpoints(
          updatedState.phaseDetail.CurrentPhaseID,
          updatedState.phasePoints
        );
        this.calculatedrillpoints();
        this.setState(updatedState);
        break;

      case 3:
        updatedState.phasePoints = this.props.GetPercentageInfo(
          updatedState.phaseDetail
        );
        const openphasePoint = this.props.GetOpenPhasePoints(
          updatedState.phaseDetail
        );
        updatedState.segment = this.props.GetSegment(updatedState.phaseDetail);
        updatedState.drillPoints = this.calculatedrillpoints(
          updatedState.phaseDetail.CurrentPhaseID,
          openphasePoint
        );
        this.setState(updatedState);
        break;

      default:
        break;
    }
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <div className="phaseDetail-container">
          <div>
            <span>Current Phase:</span>
            <span style={{ fontWeight: 800 }}>
              {this.state.phaseDetail.CurrentPhaseTitle}
            </span>
          </div>
          <div>
            <div>
              {this.state.phaseDetail.type === 0 ? (
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                  <div>
                    <span>COMPLETION %</span>
                    <span>
                      <InputNumber
                        onChange={val => this.onChagecompletion(val)}
                        value={this.state.phaseDetail.PhaseData.completion}
                        min={0}
                        max={100}
                      />
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <ProgressCapture
                    onFetchDataforPilot={pilotpass =>
                      this.onChangeInPilotPhase(pilotpass)
                    }
                    phaseDetail={this.state.phaseDetail}
                  />
                </div>
              )}
            </div>
          </div>
          <div />
          <div>
            <RadioGroup
              onChange={value => this.onChange(value)}
              defaultValue={this.state.phaseDetail.WasPhaseCompletedIndex}
            >
              <RadioButton disabled={true} value="1">
                Was <b>{this.state.phaseDetail.CurrentPhaseTitle} Phase</b>{" "}
                Completed During Shift ?
              </RadioButton>
              <RadioButton value="2">Yes</RadioButton>
              <RadioButton value="3">No</RadioButton>
            </RadioGroup>
          </div>
          <div className="phaseDetail-time-container">
            <span>{this.getTitle()}</span>
            <div>
              <TimePicker
                format="HH:mm"
                onChange={this.onChangeTime}
                value={this.state.phaseDetail.PhaseEndTime}
              />
            </div>
          </div>
          <div>
            <span>Phase Hours:</span>
            <span>{this.state.phaseDetail.Hours}</span>
          </div>
          <div>
            {this.state.phaseDetail.WasPhaseCompleted ? (
              <RadioGroup
                onChange={value => this.onChangeForNextPhase(value)}
                defaultValue={
                  this.state.phaseDetail.NextIsStartedDuringShiftIndex
                }
              >
                <RadioButton disabled={true} value="1">
                  {this.getPhase(this.state.phaseDetail.NextPhaseIndex)}
                </RadioButton>
                <RadioButton value="2">Yes</RadioButton>
                <RadioButton value="3">No</RadioButton>
              </RadioGroup>
            ) : null}
          </div>
        </div>
        <div style={{ width: "30vw" }}>
          <div>
            {this.props.phaseDetail.CurrentPhaseTitle}:
            <b>{(this.state.phasePoints * 100).toFixed(4)} % completed</b>
          </div>
          <div>
            Drill Points:
            <b>{this.state.drillPoints}</b>
            {/* <b>{(this.state.drillPoints * 100).toFixed(4)} % completed</b> */}
          </div>
          <div>
            {this.state.phaseDetail.type === 1 ? (
              <div>Segment:{this.state.segment}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
