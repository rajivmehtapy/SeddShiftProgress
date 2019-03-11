import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  onconversion = () => {
    alert("gd");
  };
  render() {
    return (
      <React.Fragment>
        <div className="App container_info">
          <div className="container_json">
            <span>Raw Json</span>
            <textarea className="textarea_source" />
          </div>
          <div className="container_json">
            <span>Target Json</span>
            <textarea className="textarea_target" />
          </div>
        </div>
        <div className="container_button">
          <button onClick={this.onconversion}>Convert to Segments</button>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
