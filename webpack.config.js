const path = require('path');

module.exports = {
    entry: {
        //'log-sign-auth': './static/dist/log-sign-auth.js',
        //'userName': './static/dist/userName.js',
        //'loginOverlay': './static/dist/loginOverlay.js',
        'logoutOverlay': './static/dist/logoutOverlay.js',
        //'dark-light-mode': './static/dist/dark-light-mode.js',
        //'signupOverlay': './static/dist/signupOverlay.js',
        //'addExpense': './static/dist/addExpense.js',
        //'fetchExpense': './static/dist/fetchExpense.js',
        //'dateChange': './static/dist/dateChange.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'static/dist'),
    },
    mode: 'production',  // Set to 'development' for development mode
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
