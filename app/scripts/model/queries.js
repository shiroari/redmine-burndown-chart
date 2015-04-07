'use strict';

var fn = {};

fn.transform = function (transport, opts) {
  return transport.queries.filter(function(d){
    //return d.is_public && d.project_id === 250;
    return true;
  });
};

module.exports = fn;