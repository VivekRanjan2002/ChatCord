const moment = require('moment');

// Format Messages
function formatMessage(username, text) {
    return {
        username,
        text,
        time:moment().format('h:mm a')
     }
}
module.exports = formatMessage;