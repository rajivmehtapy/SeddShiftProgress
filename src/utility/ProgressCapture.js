import React, { Component } from "react";
import { Select, InputNumber, Icon } from "antd";
import "./ProgressCapture.css";
import "antd/dist/antd.css";
//import * as _ from "lodash";
const Option = Select.Option;

export default class ProgressCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phaseDetail: {},
      passData: [
        {
          index: 1,
          diameter: 0,
          distance: 0
        }
      ]
    };
  }

  onAddAnotherButton = () => {
    this.state.passData.push({
      index: this.state.passData.length + 1,
      diameter: 0,
      distance: 0
    });
    this.setState({ ...this.state });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.phaseDetail.PhaseData.hasOwnProperty("workunit")) {
      const updatestate = { ...this.state };
      updatestate.passData = nextProps.phaseDetail.PhaseData.workunit;
      updatestate.phaseDetail = nextProps.phaseDetail;
      this.setState(updatestate);
    } else {
      this.setState({ ...this.state, phaseDetail: nextProps.phaseDetail });
    }
  }

  componentWillMount() {
    if (this.props.phaseDetail.PhaseData.hasOwnProperty("workunit")) {
      const updatestate = { ...this.state };
      updatestate.passData = this.props.phaseDetail.PhaseData.workunit;
      updatestate.phaseDetail = this.props.phaseDetail;
      this.setState(updatestate);
    } else {
      this.setState({ ...this.state, phaseDetail: this.props.phaseDetail });
    }
  }

  onChangeinDataEntry(value, field, key) {
    const updatedstate = {
      ...this.state
    };
    if (this.state.phaseDetail.CurrentPhaseID === 2) {
      updatedstate.passData[0][field] = value;
      this.setState(updatedstate, () => {
        this.props.onFetchDataforPilot(this.state.passData);
      });
    } else {
      //let index = _.isObject(key) ? Number(key.key) - 1 : Number(key) - 1;
      let index = key;
      updatedstate.passData[index][field] = value;
      this.setState(updatedstate, () => {
        this.props.onFetchDataforPilot(this.state.passData);
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.passData.map((pass, index) => {
          return (
            <div className="drill-entry-container" key={index}>
              {this.state.phaseDetail.CurrentPhaseID === 2 ? (
                <div>
                  <span>Ream Size</span>
                  <Select
                    value={pass.diameter}
                    onChange={v => this.onChangeinDataEntry(v, "diameter")}
                    style={{ width: 120 }}
                  >
                    <Option value="7">7"</Option>
                    <Option value="8">8"</Option>
                    <Option value="10">10"</Option>
                    <Option value="11">11"</Option>
                    <Option value="12">12"</Option>
                  </Select>
                </div>
              ) : (
                <div>
                  <span>Ream Size</span>
                  <Select
                    value={pass.diameter}
                    onChange={(v, k) => {
                      this.onChangeinDataEntry(v, "diameter", index);
                    }}
                    style={{ width: 120 }}
                  >
                    <Option key={pass.index} value="14">
                      14"
                    </Option>
                    <Option key={pass.index} value="16">
                      16"
                    </Option>
                    <Option key={pass.index} value="18">
                      18"
                    </Option>
                    <Option key={pass.index} value="20">
                      20"
                    </Option>
                    <Option key={pass.index} value="22">
                      22"
                    </Option>
                    <Option key={pass.index} value="24">
                      24"
                    </Option>
                    <Option key={pass.index} value="26">
                      26"
                    </Option>
                    <Option key={pass.index} value="28">
                      28"
                    </Option>
                    <Option key={pass.index} value="30">
                      30"
                    </Option>
                    <Option key={pass.index} value="32">
                      32"
                    </Option>
                    <Option key={pass.index} value="34">
                      34"
                    </Option>
                    <Option key={pass.index} value="36">
                      36"
                    </Option>
                    <Option key={pass.index} value="38">
                      38"
                    </Option>
                    <Option key={pass.index} value="40">
                      40"
                    </Option>
                    <Option key={pass.index} value="42">
                      42"
                    </Option>
                    <Option key={pass.index} value="44">
                      44"
                    </Option>
                    <Option key={pass.index} value="46">
                      46"
                    </Option>
                    <Option key={pass.index} value="48">
                      48"
                    </Option>
                    <Option key={pass.index} value="50">
                      50"
                    </Option>
                    <Option key={pass.index} value="52">
                      52"
                    </Option>
                    <Option key={pass.index} value="54">
                      54"
                    </Option>
                    <Option key={pass.index} value="56">
                      56"
                    </Option>
                  </Select>
                </div>
              )}

              <div>
                <span>Distance</span>
                <InputNumber
                  value={pass.distance}
                  onChange={v => this.onChangeinDataEntry(v, "distance", index)}
                  min={1}
                  max={1000000}
                />
              </div>
            </div>
          );
        })}
        {this.state.phaseDetail.CurrentPhaseID !== 2 ? (
          <div onClick={this.onAddAnotherButton} className="add-another">
            <Icon type="plus-circle" />
            <span>add another</span>
          </div>
        ) : null}
      </div>
    );
  }
}
