/** @jsx React.DOM */

var Header = React.createClass({
  getInitialState: function() {
    return {name: this.props.name};
  },
  render: function() {
    return (
			<div>
				<div className="card-header">
					{this.props.name}
				</div>
			</div>
    );
  }
});

var Actions = React.createClass({
  render: function() {
		if (!this.props.actions) 
			return (<div className="no-card-actions"/>);
    return (
			<ul className="card-actions">
				{this.props.actions.map(function(action) {
          	return <li>
							<a href="#">{action.name}</a>
						</li>;
        })}
			</ul>
    );
  }
});

var Card = React.createClass({
  getInitialState: function() {
		return {};
  },
  componentDidMount: function() {
    
  },
  componentWillUnmount: function() {
    
  },
  render: function() {
    return (
			<div className={'grid-cell-' + (this.props.colSpan || 1)}>
				<section className={'card ' + (this.props.className || 'card-basic')}>
					<Header name={this.props.name}/>
					<Actions actions={this.props.actions}/>
					<div className='card-content'>
					{React.Children.map(this.props.children, function(child) {
							return child;
					})}		
					</div>
				</section>
			</div>
    );
  }
});

module.exports = Card;