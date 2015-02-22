/** @jsx React.DOM */

var React = require("react"),
		Card = require("./Card.jsx"),
		ControlPanel = require("./ControlPanel.jsx"),
		NVChart = require("./NVD3Chart.jsx"),
		MGChart = require("./MGChart.jsx");		

var View = {};

View.render = function(parent){
	
		React.render(<div className="grid">
			<Card name="Control" rowSpan="2">
				<ControlPanel/>
			</Card>
			<div className="grid-cell-2">
				<Card name="Burndown chart" colSpan="2">
					<NVChart id="nv_chart_burndown" type="burndown"/>
				</Card>
				<Card name="Stacked chart" colSpan="2">
					<NVChart id="nv_chart_stack" type="stacked"/>
				</Card>
			</div>
			</div>, parent);
			
};
						 
module.exports = View;