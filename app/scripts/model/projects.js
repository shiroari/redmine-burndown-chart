'use strict';

var fn = {};

fn.transform = function (transport, opts) {
  return transport.projects;
};

module.exports = fn;