var React = require("react"),
  Header = require("./CardHeader.jsx");

var Card = React.createClass({

  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {

  },

  componentWillUnmount: function () {

  },

  render: function () {

    var self = this,

    children = this.props.children.length ? this.props.children : [this.props.children],

    filteredChildren = children.filter(function (child) {
      return (child.type.displayName !== "Header");
    }),

    headers = children.filter(function (child) {
      return (child.type.displayName === "Header");
    }),

    header = (headers.length === 1) ? headers[0] : null;

    var headerRenderer = function () {
      if (header) {
        header.props.name = self.props.name;
        return header;
      }
      return <Header name={self.props.name}/>;
    };

    return (
			<div className={"grid-cell-" + (this.props.colSpan || 1)}>
				<section className="card">
          {headerRenderer()}
					<div className="card-content">
					{React.Children.map(filteredChildren, function (child) {
            return child;
					})}
					</div>
				</section>
			</div>
    );
  }
});

module.exports = Card;
