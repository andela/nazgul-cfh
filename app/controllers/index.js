/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */
exports.play = (req, res) => {
  let { region, custom } = req.query;
  if (custom !== 'true') custom = false;
  if (!region) {
    const regions = ['africa', 'asia'];
    region = regions[Math.floor(Math.random() * 2)];
  }
  res.redirect(`/#!/app?custom=${custom}&region=${region}`);
};

exports.render = function(req, res) {
  res.render('index');
};