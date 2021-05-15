exports.success = function (req, res, message, status, details) {
    res.status(status || 200).send({
      body: message,
      details: details,
    });
  };
  
  exports.error = function (req, res, message, status, details) {
    console.error('[response error] ' + details);
  
    res.status(status || 500).send({
      error: message,
      body: '',
      details: details,
    });
  };