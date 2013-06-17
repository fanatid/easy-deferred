var Deferred = (function DeferredClosure() {
  var STATUS_PENDING = 0;
  var STATUS_RESOLVED = 1;
  var STATUS_REJECTED = 2;

  function Deferred() {
    this._status = STATUS_PENDING;
    this._handlers = [];
  }

  Deferred.all = function Deferred_all(deferreds) {
    var deferred = new Deferred();
    var unresolved = deferreds.length;
    if (unresolved === 0) {
      deferred.resolve();
    } else {
      for (var i = 0, ii = deferreds.length; i < ii; ++i) {
        deferreds[i].then(function() {
          if (--unresolved === 0)
            deferred.resolve();
        }, function() {
          deferred.reject();
        });
      }
    }
    return deferred;
  }

  function hash2array(obj) {
    var res = new Array();
    for (prop in obj)
      res.push(obj[prop]);
    return res;
  }

  Deferred.prototype = {
    _status: null,
    _handlers: null,

    get isResolved() {
      return this._status === STATUS_RESOLVED;
    },

    get isRejected() {
      return this._status === STATUS_REJECTED;
    },

    _update: function Deferred__update(status, args) {
      if (this._status === STATUS_PENDING) {
        this._status = status;
        var j = 'onResolve';
        if (status === STATUS_REJECTED)
          j = 'onReject';
        for (var i = 0; i < this._handlers.length; ++i)
          if (typeof this._handlers[i][j] == 'function')
            this._handlers[i][j].apply(undefined, args);
      }
    },

    resolve: function Deferred_resolve() {
      this._update(STATUS_RESOLVED, hash2array(arguments));
    },

    reject: function Deferred_reject() {
      this._update(STATUS_REJECTED, hash2array(arguments));
    },

    then: function Deferred_then(onResolve, onReject) {
      if (this._status === STATUS_RESOLVED) {
        onResolve();
      } else if (this._status === STATUS_REJECTED) {
        onReject();
      } else {
        this._handlers.push({
          onResolve: onResolve,
          onReject: onReject
        });
      }
      return this;
    }
  };

  return Deferred;
})();

module.exports = Deferred;
