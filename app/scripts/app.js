/** @jsx React.DOM */

var React = window.React = require('react'),
		Card = require("./ui/Card"),
		CardProps = require("./ui/CardProps"),
		Dummy = require("./ui/Dummy"),
		NVChart = require("./ui/NVD3Chart"),
		MGChart = require("./ui/MGChart");
		

React.render(<div>						 				 
							 <Card name="Metrics chart" colSpan="2">
									<MGChart id="mg_chart"/>
							 </Card>
							 <Card name="Chart" colSpan="2">
									<NVChart id="nv_chart"/>
							 </Card>
							 <Card name="Test">
									<Dummy/>
							 </Card>
						 <CardProps name="Properties" 
						 	actions={[{name: 'Create'},{name: 'Edit'}]} 
						 	props={[{name: 'Title', value: 'My App'}, {name: 'Date', value: '10/10/2015'}]}>
						 </CardProps>		
						 </div>,
						 document.getElementById("view"));

