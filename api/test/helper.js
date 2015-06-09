var mongoose = require('mongoose');
var Q = require('q');

module.exports.mongo = function(connection) {
  var deferred = Q.defer();
  mongoose.connect(connection, function() {
    mongoose.connection.db.dropDatabase(deferred.resolve);
  });
  return deferred.promise;
};