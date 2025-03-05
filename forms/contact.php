const { exec } = require('child_process');

exports.handler = (event, context, callback) => {
  exec('php netlify/functions/contact.php', (error, stdout) => {
    if (error) {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: "PHP execution failed." }),
      });
    }
    callback(null, {
      statusCode: 200,
      body: stdout,
    });
  });
};
