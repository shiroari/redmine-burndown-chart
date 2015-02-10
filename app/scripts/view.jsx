/** @jsx React.DOM */

var Card = require("./ui/Card.jsx"),
		CardProps = require("./ui/CardProps.jsx"),
		Dummy = require("./ui/Dummy.jsx"),
		NVChart = require("./ui/NVD3Chart.jsx"),
		MGChart = require("./ui/MGChart.jsx");
		

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
						 
