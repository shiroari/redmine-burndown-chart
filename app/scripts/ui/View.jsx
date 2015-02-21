/** @jsx React.DOM */

var React = require("react"),
		Card = require("./Card.jsx"),
		NVChart = require("./NVD3Chart.jsx"),
		MGChart = require("./MGChart.jsx");		

var View = {};

View.render = function(parent){
	
		React.render(<div>
			<Card name="Control" rowSpan="2">
			</Card>
			<Card name="Burndown chart" colSpan="2">
				<NVChart id="nv_chart"/>
			</Card>
			<Card name="Details" colSpan="2"/>
			</div>, parent);
			
};
						 
module.exports = View;