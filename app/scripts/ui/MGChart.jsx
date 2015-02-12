/** @jsx React.DOM */
var $model = require('./../model/model'),
		MG = require('metrics-graphics');

var Chart = React.createClass({
	componentDidMount: function() {
		$model.onUpdate(this.renderChart);
		$model.start();
  },
	renderChart: function(model) {
		
		$('#' + this.props.id).empty();
		
		var props = {
				target: '#' + this.props.id,			
				data: [model.data[0], model.data[1], model.data[2]],
				x_accessor: 'date',
				y_accessor: 'diff',
				min_x : model.start,
				max_x : model.end,
				height: 260,
				full_height: true,
				full_width: true,
				animate_on_load: true,
				show_tooltips: false,
				aggregate_rollover: true,
				interpolate: false,
				area: false,
				custom_line_color_map: [3,2,1],
				legend: ['Todo', 'Review', 'Test'],
				legend_target: '#' + this.props.id + '_legend',
				small_text: true,
				show_secondary_x_label: false,
				xax_count: (model.endIndex - model.startIndex)
			};
			
			if (model.goal){
				props.baselines = [{value: model.goal, label: 'Goal = ' + model.goal}];
			}
			
			MG.data_graphic(props);
					
	},
  render: function() {
    return (
			<div>
				<div id={this.props.id + '_legend'} className='mg_legend'></div>
				<div id={this.props.id}></div>	
			</div>
		);
  }
});

module.exports = Chart;