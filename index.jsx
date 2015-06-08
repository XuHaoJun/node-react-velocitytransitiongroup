var React = require('react');
var ReactTransitionGroup = require('react/addons').addons.TransitionGroup;
var Velocity = require('velocity-animate');
require('velocity-animate/velocity.ui.js');

function _bindComplete(func, node, done, name) {
  func.bind(this)(node, name);
  done();
}

var VelocityTransitionGroupChild = React.createClass({
  _addTransition: function(node, done, name) {
    var i = 0;
    var length = this.props[name].length - 1;
    for (i=0; i<=length; i++) {
      if (i == length) {
        if (this.props[name][i][1]) {
          if (this.props[name][i][1].complete) {
            this.props[name][i][1].complete = _bindComplete.bind(this)(
              this.props[name][i][1].complete,
              node, done, name
            );
          } else {
            this.props[name][i][1].complete = done;
          }
        } else {
          this.props[name][i][1] = {complete: done};
        }
      }
      Velocity(node,
               this.props[name][i][0],
               this.props[name][i][1]);
    }
  },

  componentWillEnter: function(done) {
    if (this.props.enterTransition) {
      var node = React.findDOMNode(this);
      this._addTransition(node, done, 'enterTransition');
    } else {
      done();
    }
  },

  componentWillLeave: function(done) {
    if (this.props.leaveTransition) {
      var node = React.findDOMNode(this);
      this._addTransition(node, done, 'leaveTransition');
    } else {
      done();
    }
  },

  render: function() {
    return React.Children.only(this.props.children);
  }
});

var VelocityTransitionGroup = React.createClass({
  propTypes: {
    enterTransition: React.PropTypes.array,
    leaveTransition:React.PropTypes.array,
  },

  _wrapChild: function(child) {
    return (
      <VelocityTransitionGroupChild enterTransition={this.props.enterTransition}
                                    leaveTransition={this.props.leaveTransition} >
	  {child}
      </VelocityTransitionGroupChild>
    );
  },

  render: function() {
    return (
      <ReactTransitionGroup {...this.props}
                            childFactory={this._wrapChild}
      />
    );
  }
});

module.exports = VelocityTransitionGroup;
