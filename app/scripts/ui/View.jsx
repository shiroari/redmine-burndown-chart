var React = require("react"),
		Card = require("./Card.jsx"),
    Header = require("./CardHeader.jsx"),
    Action = require("./Action.jsx"),
		ControlPanel = require("./ControlPanel.jsx"),
		NVChart = require("./NVD3Chart.jsx");		

var dispatcher = {};

var openSettings = function(event){
  dispatcher.on(event);
};

module.exports = {

  render: function(parent){

    React.render(
      <div className="grid">
        <Card name="Presets">
          <Header>
            <Action name="Settings" onClick={openSettings}>
              <i className="fa fa-cog"/>
            </Action>
          </Header>
          <ControlPanel bind={dispatcher}/>
        </Card>
        <div className="grid-cell-2">
          <Card name="Burndown chart" colSpan="2">
            <NVChart id="burndown-chart" type="burndown"/>
          </Card>
          <Card name="Stacked chart" colSpan="2">
            <NVChart id="stack-chart" type="stacked"/>
          </Card>
        </div>
      </div>
      , parent);

  }

};
