/** @jsx React.DOM */
var Card = require('./Card.jsx');

var CardProps = React.createClass({
  render: function() {
    return (
			<Card className="card-props" {...this.props}>
        <table>
        {this.props.props.map(function(prop) {
            return <tr>
              <th>{prop.name}</th>
              <td>{prop.value}</td>
            </tr>;
        })}
        </table>
			</Card>
    );
  }
});

module.exports = CardProps;