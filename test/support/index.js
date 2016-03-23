exports.init = function (callback) {
  var mongo = require('mongodb');

  var settings = require('./settings').testing;

  var url = 'mongodb://' + settings.mongo.host + ':' + settings.mongo.port + '/' + settings.mongo.db;

  mongo.MongoClient.connect(url, function (err, db) {
    if (err) return console.log('Error on connection to db', err);

    global.db = db;
    global.ObjectID = mongo.ObjectID;
    callback();

  });

  global.expect = require('chai').expect;
};