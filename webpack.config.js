const path = require('path');

module.exports = {
    entry: {
        'log-sign-auth': './static/log-sign-auth.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'static/dist'),
    },
    mode: 'production',  // Set to 'development' for development mode
};
