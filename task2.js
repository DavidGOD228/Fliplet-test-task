const ExpressBrute = require('express-brute');
const MemcachedStore = require('express-brute-memcached');

let store = new MemcachedStore(['127.0.0.1']);

function bruteforce(namespace, freeRetries, minWait) {
    const bruteforce = new ExpressBrute(store, {
        freeRetries: freeRetries,
        minWait: minWait * 60 * 1000, // Convert minutes to milliseconds
        failCallback: function (req, res, next, nextValidRequestDate) {
            res.status(429).send(`Too many requests for the ${namespace} namespace. Please retry in ${Math.round((nextValidRequestDate.getTime() - Date.now()) / 60 / 1000)} minutes.`);
        }
    });

    // Return a function that can either be used as a middleware or a promise
    return function (req, res, next) {
        if (typeof next === 'function') {
            // Used as middleware
            bruteforce.prevent(req, res, next);
        } else {
            // Used as a promise
            return new Promise((resolve, reject) => {
                bruteforce.prevent(req, res, function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    }
}

// Express app setup
const express = require('express');
const app = express();
const router = express.Router();

// Global bruteforce
app.use(bruteforce('global', 100, 5))

// Route specific middleware
router.get('v1/users', bruteforce('users', 50, 1), function (req, res) {
    res.send('Protected route');
})

router.get('v1/apps', async function (req, res) {
    try {
        // Promise-based middleware
        await bruteforce('apps', 30, 2)(req, res);
        res.send('Protected route');
    } catch (err) {
        res.status(err.code).send(err.message);
    }
})

app.use('/', router);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});