'use strict';

var session_model = require('.././db/db_sessions');
var moment = require('moment');

(function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
})();


// http://localhost:8080/sessions/:sessionID
exports.fetchSession = function(req, res, next) {
	req.checkParams('sessionID', 'Invalid PostParam').notEmpty().isInt();
    session_model.fetchSingleSession(req.params.sessionID, function(err, resp) {
        if (err) next(err);
        res.json(resp.rows);
    })
};

exports.fetchAllSessions = function(req, res, callback) {
    session_model.fetchAllSessions(function(err, result) {
        if (!result) {
            console.log(err);
            callback(err);
        } else if (err) {
					return callback(err);
				}
        var schedule = result.rows;
        for (var i = 0; i < schedule.length; i++) {
          var sessiondate = moment(schedule[i].calendar);
          schedule[i].daydatetime = sessiondate.format("dddd, MMMM Do");
          var a = moment.duration(schedule[i].duration);
          schedule[i].sessionTime = sessiondate.format('h:mm') + ' - ' + sessiondate.add(a).format('h:mm A');
        }
        var sortedSchedule = schedule.sortBy(function(o) { return o.calendar });
        res.json(sortedSchedule);

    });
};

exports.fetchAllIntervals = function(req, res, callback) {
    session_model.fetchAllIntervals(function(err, result) {
        if (err) {
            callback(err);
        }
        res.json(result.rows);
    })
};
