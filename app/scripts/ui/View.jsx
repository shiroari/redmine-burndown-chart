/** @jsx React.DOM */

var Card = require("./Card.jsx"),
		CardProps = require("./CardProps.jsx"),
		ControlPanel = require("./ControlPanel.jsx"),
		NVChart = require("./NVD3Chart.jsx"),
		MGChart = require("./MGChart.jsx");
		

var View = {};

View.render = function(parent){
	
		React.render(<div>
			<Card name="Control" rowSpan="2">
				<ControlPanel/>
			</Card>
			<Card name="Burndown chart" colSpan="2">
				<NVChart id="nv_chart"/>
			</Card>
			<Card name="Details" colSpan="2"/>
			</div>, parent);
			
};
						 
module.exports = View;