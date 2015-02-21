/** @jsx React.DOM */
var React = require("react"),
		$model = require('./../model/model'),
		nvd3 = require('nvd3');
		
var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];		

var transformData = function(model){
	return [
		{
			key: 'Todo',
			color: '#2ca02c',
			values: model.data[0]
		},
		{
			key: 'Review',
			color: '#ff7f0e',
			values: model.data[1]
		},
		{
			key: 'Test',
			color: '#6c6cd0',
			values: model.data[2]
		},
		{
			key: 'Velocity',
			color: 'rgba(0,0,0,.9)',
			values: model.data[3]
		},
		{
			key: 'Goal',
			color: 'rgba(240,0,0,.6)',
			values: [
				{index: model.startIndex, diff: model.goal},
				{index: model.endIndex, diff: model.goal}
			]
		}	
	];
};

var Chart = React.createClass({	

	componentDidMount: function() {
		$model.onUpdate(this.renderChart);
		$model.start();
  },
	
  handleClick: function(event) {
		$model.update();
  },		
	
  render: function() {
    return (
			<div>
				<div id={this.props.id}>
					<svg></svg>
				</div>
			</div>
    );
  },
	
	renderChart: function(model) {
		
		var id = this.props.id,
				chartFunc;
		
		if (this.chart === undefined){
			
			this.chart = null;
			
			chartFunc = function(model){

				var self = this;
				
				nv.addGraph(function(){
					
						var chart = nv.models.lineChart()//.stackedAreaChart()
							.clipEdge(true)
							.x(function(d){return d.index;})
							.y(function(d){return d.diff;})
							.useInteractiveGuideline(true);

						chart.xAxis
							.showMaxMin(false)
							.tickFormat(function(d) { return DAYS[d]; });
						;

						chart.yAxis
							.axisLabel('Hours (h)')
							.tickFormat(d3.format('.0'));

						chart.forceY([model.minY, model.maxY]);
						chart.forceX([model.startIndex, model.endIndex]);

						d3.select('#' + id + ' svg')
							.datum(transformData(model))
							.transition()
							.duration(500)
							.call(chart);

						nv.utils.windowResize(chart.update);
					
						self.chart = chart;
					
						return chart;
				});
				
			};			
			
		} else if (this.chart) {
			
			chartFunc = function(model) {
				
				d3.select('#' + id + ' svg')
					.datum(transformData(model));
				this.chart.dispatch.changeState(this.chart.state());
				this.chart.update();
				
			}
			
		} else {
			
			chartFunc = function(model) {};
			
		}
		
		chartFunc.apply(this, [model]);
	}
});

module.exports = Chart;