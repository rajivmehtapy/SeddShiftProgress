import React, { Component } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Steps, Button, message, DatePicker, TimePicker, Input } from "antd";
import moment from "moment";
const Step = Steps.Step;

const steps = [
  {
    title: "RigUP",
    content: "First-content"
  },
  {
    title: "Pilot",
    content: "Second-content"
  },
  {
    title: "Open",
    content: "Last-content"
  },
  {
    title: "Close",
    content: "Last-content"
  }
];
class PhaseProgression extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { current } = this.state;

    return (
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <div className="progress-container">
            <div className="progress-container-row">
              <span>Date:</span>
              <DatePicker placeholder="Select month" />
            </div>
            <div className="progress-container-row">
              <span>Starting Phase:</span>
              <Input placeholder="Basic usage" />
            </div>
            <div className="progress-container-row">
              <span>Start Time:</span>
              <TimePicker
                width="100"
                use12Hours
                format="h:mm:ss A"
                defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
              />
            </div>
          </div>
        </div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{ marginLeft: 8, display: "none" }}
              onClick={() => this.prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default PhaseProgression;
