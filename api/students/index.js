var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var config = require('../../config');

var mongoDb;

var url = config.mongodbUri;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  config.logStars("Connected correctly to server.");
  mongoDb = db;
});

// Get list of students
exports.index = function(req, res) {
   // Connect to the db
    if (mongoDb){
      var collection = mongoDb.collection('students');
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
    }
    else
    {
        config.logStars('No database object!');
        res.status(404).send({});
    }
};
// Creates a new student in datasbase.
exports.create = function(req, res) {
  var student = req.body;
    if (mongoDb){
      var collection = mongoDb.collection('students');
      collection.insertOne(student, function(err, result) {
            assert.equal(err,null);
            config.logStars('Inserted: ' + JSON.stringify(result));
            res.status(200).send(result);
            
        });
    }
  else
  {
    config.logStars('No database object!');
  }
   
};

// Update an existing student in database.
exports.update = function(req, res) {
  var id = req.params.id;
  var student = req.body;
  config.logStars('Updating student: ' + id);
  var collection = mongoDb.collection('students');
  collection.updateOne({'_id':ObjectId(id)}, student, function(err, result) {
           assert.equal(err,null);
              console.log('' + result + ' document(s) updated');
              res.status(200).send(result);
  });
   
};
// delete an existing student in database.
exports.delete = function(req, res) {
    var id = req.params.id;
  config.logStars('Deleting student: ' + id);
  var collection = mongoDb.collection('students');
  collection.deleteOne({'_id':ObjectId(id)}, function(err, result) {
           assert.equal(err,null);
          console.log('' + result + ' document(s) deleted');
          res.status(200).send(result);
  });
   
};