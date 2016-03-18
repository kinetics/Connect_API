'use strict';

var db_networking = require('../.././db/db_users/db_networking');
var alert = require('.././alerts_ctrl');

exports.userShare = function(req, res, callback) {
  // TODO: We need to add request checks at the router level that dump requests with extra data. Otherwise, any user could use another user's id via
  // the request object for specific user resources.
  db_networking.user_share(req.params.userID, req.params.friendID, function(err, result) {
    if (err) return callback(err); 
    if (result.rows[0].user_share_details === true) {
      res.status(304).send('Request has already been sent.');
    } else {
      // Create notification data.
      var user = req.decoded;
      user.userToID = req.body.userToID;
      // TODO check the azure tag for existence of user first.
      /*
      alert.friendRequestNotification(user.userToID, function(err, result) {
        if (err) return callback(err);
      });
      */
      res.status(201).send('Share request created.');
    }
  });
};

exports.fetchUserFriends = function(req, res, callback) {
  console.log('fetch user friends called');
  db_networking.fetch_user_friends(req.params.userID, function(err, result) {
    if (err) return callback(err);
    if (result.rows.length === 0) {
      res.status(200).send({'message':'Nothing to show.'});
    } else {
      res.status(200).send(result.rows);
    }
  })
};

exports.removeUserShare = function(req, res, callback) {
  db_networking.remove_user_share(req.params.userID, req.params.userFriendID, function(err, result) {
    if (err) return callback(err);
    if (result.rows[0].remove_user_share === false) {
      res.status(304).send('User already removed');
    } else {
      res.status(200).send(result.rows);
    }
  });
};

exports.fetchShareRequests = function(req, res, callback) {
  db_networking.fetch_share_requests(req.params.userID, function(err, result) {
    if (err) return callback(err);
    if (result.rows[0] === 0) {
      res.status(304).send('No requests');
    } else {
        res.status(200).send(result.rows);
    }
  });
};

exports.usersSharedTo = function(req, res, callback) {
  db_networking.users_shared_to(req.params.userID, function(err, shared) {
    if (err) return callback(err);
    res.status(200).send(shared.rows);
  });
};

exports.fetchUsers = function(req, res, callback) {
  db_networking.fetch_users(function(err, result) {
    if (err) return callback(err);
    if (result.rows[0].length === 0) {
      res.status(304).send({'message':"nothing to show"});
    } else {
      res.status(200).send(result.rows);
    }
  });
};
