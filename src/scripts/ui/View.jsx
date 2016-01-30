var React = require("react"),
		ReactDOM = require("react-dom"),
		AppDispatcher = require('../AppDispatcher'),
		Action = require("./Action.jsx"),
		Card = require("./Card.jsx"),
    Header = require("./CardHeader.jsx"),
		ControlPanel = require("./ControlPanel.jsx"),
		Chart = require("./NVD3Chart.jsx");

var toggleSettings = function (){
	AppDispatcher.toggleSettings();
};

var view = {

	render: function(parent) {

		ReactDOM.render(
			<div className="grid">
				<Card name="Presets">
					<Header>
						<Action name="Settings" onClick={toggleSettings}>
							<i className="fa fa-cog"/>
						</Action>
					</Header>
					<ControlPanel/>
				</Card>
				<div className="grid-cell-2">
					<Card name="Burndown chart" colSpan="2">
						<Chart id="burndown-chart" type="burndown"/>
					</Card>
					<Card name="Stacked chart" colSpan="2">
						<Chart id="stack-chart" type="stacked"/>
					</Card>
				</div>
			</div>, $(parent)[0]);

	}

};

module.exports = view;
