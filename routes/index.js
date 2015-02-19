var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('underscore');
var controller = require('../lib/controller');
var RESULTS_LIMIT = 100;
var S = require('string');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('default', {title: 'Express'});
});

router.get('/videos', function (req, res, next) {
    async.waterfall([
        function (callback) {
            if (!req.session.model || !req.session.model.videos) {
                controller.loadVideos(callback);
            } else {
                callback(null, req.session.model.videos);
            }
        },
        function (videos, callback) {
            controller.sortVideos(videos, RESULTS_LIMIT, callback);
        },
        function (videos, callback) {
            controller.buildModel(videos, req, true, callback)
        }
    ], function (err, results) {
        var template = 'index';

        if (req.query.partial) {
            template = 'list-videos'
        }

        controller.renderSend(template, results, res, function (err, status) {
            console.log(status);
        });

    });
});

router.get('/videos/:filter', function (req, res, next) {
    var videos = req.session.model.videos;
    var filter = req.params['filter'].toLowerCase();

    async.waterfall([
        function (callback) {
            callback(null, videos, filter);
        },
        function (videos, filter, callback) {
            videos = _.filter(videos, function (video) {
                if (S(video.title.toLowerCase()).contains(filter) || controller.filterArtist(video.artists, filter)) {
                    return true;
                }
            });
            callback(null, videos);
        },
        function (videos, callback) {
            if (videos) {
                controller.sortVideos(videos, RESULTS_LIMIT, callback);
            } else {
                callback(null, null);
            }
        },
        function (videos, callback) {
            if (videos) {
                controller.buildModel(videos, req, false, function (err, model) {
                    callback(null, model);
                })
            } else {
                callback(null, {});
            }
        }
    ], function (err, results) {
        controller.renderSend('list-videos', results, res, function (err, status) {
            console.log(status);
        });
    });
});

router.get('/video/:id', function (req, res, next) {
    var videos = req.session.model.videos;
    var videoId = req.params['id'];
    var result = _.findWhere(videos, {id: videoId}) || {};

    res.set({'Content-Type': 'application/json'});
    res.send(JSON.stringify(result));
});

router.put('/videos/:id', function (req, res, next) {
    var videos = req.session.model.videos;
    var videoId = req.params['id'];

    if (req.body.unit) {
        _.findWhere(videos, {id: videoId}).votes.total += Number(req.body.unit);
        req.session.model.videos = videos;
        res.set({'Content-Type': 'application/json'});
        res.send('{message: success}');
        return;
    }
    res.send('{message: failed}')
});

module.exports = router;
