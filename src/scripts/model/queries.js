'use strict';

var fn = {};

fn.transform = function (transport, opts) {
  return transport.queries.filter(function (d) {
    return d.project_id == opts.project;
  });
};

module.exports = fn;
