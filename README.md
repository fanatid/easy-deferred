# Easy deferred

## Installation
    npm install easy-deferred

## Usage
    var Deferred = require('easy-deferred');
    var fs = require('fs');

    var d = new Deferred();
    d.then(function(data) {
      console.log('Success: ' + data)
    }, function(error) {
      console.log('Error: ' + error)
    })
    fs.readFile('/etc/shadow', function (err, data) {
      if (err)
        d.reject(err);
      else
        d.resolve(data);
    });

## API
* `new Deferred()`
* `Deferred.all()`
* `deferred.isResolved`
* `deferred.isRejected`
* `deferred.resolve()`
* `deferred.reject()`
* `deferred.then()`

