var Encoder = require('qr').Encoder;
var encoder = new Encoder;
var db_qr = require('../.././db/db_users/db_qr');

exports.generateAndStoreQR = function(req, res, callback) {
  encoder.on('end', function(png_data) {
    db_qr.store_user_qr(req.params.userID, png_data, function(err, result) {
      if (err) return callback(err);
      res.status(200).send(png_data);
    });
  });
  encoder.encode(user);
};

exports.fetchUserQR = function(req, res, callback) {
  db_qr.fetch_user_qr(req.params.userID, function(err, qrImg) {
    if (err) return callback(err);
    res.status(200).send(qrImg);
  });
};

exports.qrScanned  = function(req, res, callback) {
  db_qr.qr_scanned(req.params.userID, req.params.toUserID, function(err, result) {
    if (Err) return callback(err);
    res.status(200).send(result);
  });
};