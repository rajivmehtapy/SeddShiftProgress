import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    sourcejson: `{
      "firstname": "mm"
    }`
  };

  onSourceChange = ev => {
    const updatestate = { ...this.state };
    updatestate.sourcejson = ev.currentTarget.value;
    this.setState(updatestate);
  };

  onconversion = () => {
    alert(JSON.parse(this.state.sourcejson).firstname);
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
            <textarea className="textarea_target" />
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
