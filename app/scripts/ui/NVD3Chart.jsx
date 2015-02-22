/** @jsx React.DOM */
var React = require("react"),
		$model = require('./../model/model'),
		nvd3 = require('nvd3');
		
var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];		

var transformBurndownData = function(model){
	return [
		{
			key: 'Todo',
			color: '#2ca02c',
			values: model.data[0]
		},
		{
			key: 'Testing',
			color: '#6c6cd0',
			values: model.data[2],
			disabled: true
		},
		{
			key: 'Review',
			color: '#ff7f0e',
			values: model.data[1],
			disabled: true
		},
		{
			key: 'Goal',
			color: '#ff6347',
			values: [
				{index: model.startIndex, diff: model.goal},
				{index: model.endIndex, diff: model.goal}
			]
		},
		{
			key: 'Velocity',
			color: '#888',
			values: model.data[4],
			disabled: true
		}
	];
};

var transformStackedData = function(model){
	return [
		{
			key: 'Closed',
			color: '#2ca02c',
			values: model.data[0]
		},
		{
			key: 'Testing',
			color: '#6c6cd0',
			values: model.data[2]
		},
		{
			key: 'Review',
			color: '#ff7f0e',
			values: model.data[1]
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
	
		if (this.props.type === 'burndown'){
			this.renderBurndownChart(model);
		} else if (this.props.type === 'stacked'){
			this.renderStackedChart(model);
		}
	
	},
	
	renderBurndownChart: function(model) {
		
		var id = this.props.id,
				chartFunc;
		
		if (this.chart === undefined){
			
			this.chart = null;
			
			chartFunc = function(model){

				var self = this,
						data = transformBurndownData(model);
				
				nv.addGraph(function(){
					
						var chart = nv.models.lineChart()
							.clipEdge(true)
							.x(function(d){return d.index;})
							.y(function(d){return d.diff;})
							.useInteractiveGuideline(true);

						chart.xAxis							
							.showMaxMin(false)
							.tickValues([0,1,2,3,4,5,6,7,8,9,10,11])
							.tickFormat(function(d) { return DAYS[d]; });
							//.tickFormat(function(d) { return DAYS[data[0].values[d].date.getDay()]; });
						;

						chart.yAxis
							.axisLabel('Hours (h)')
							.tickFormat(d3.format('.0'));

						chart.forceY([model.minY, model.maxY]);
						chart.forceX([model.startIndex, model.endIndex]);

						d3.select('#' + id + ' svg')
							.datum(data)
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
					.datum(transformBurndownData(model));
				this.chart.dispatch.changeState(this.chart.state());
				this.chart.update();
				
			}
			
		} else {
			
			chartFunc = function(model) {};
			
		}
		
		chartFunc.apply(this, [model]);
	},
	
	renderStackedChart: function(model) {
		
		var id = this.props.id,
				chartFunc;
		
		if (this.chart === undefined){
			
			this.chart = null;
			
			chartFunc = function(model){

				var self = this;
				
				nv.addGraph(function(){
					
						var chart = nv.models.stackedAreaChart()
							.clipEdge(true)
							.x(function(d){return d.index;})
							.y(function(d){return d.val;})
							.useInteractiveGuideline(true);

						chart.xAxis							
							.showMaxMin(false)
							.tickValues([0,1,2,3,4,5,6,7,8,9,10,11])
							.tickFormat(function(d) { return DAYS[d]; });
						;

						chart.yAxis
							.axisLabel('Hours (h)')
							.tickFormat(d3.format('.0'));

						chart.forceY([model.minY, model.maxY]);
						chart.forceX([model.startIndex, model.endIndex]);

						d3.select('#' + id + ' svg')
							.datum(transformStackedData(model))
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
					.datum(transformStackedData(model));
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