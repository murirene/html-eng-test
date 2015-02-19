"use strict";
var shortId = require('shortid');
var _ = require('underscore');
var S = require('string');

function loadVideos(callback) {
    var fs = require('fs');
    fs.readFile('topVideos.json', 'utf8',
        function (err, data) {
            if (err) {
                return callback(err);
            }

            data = JSON.parse(data);
            _.each(data.videos, function(video){
                video.id=shortId.generate();
            });
        callback(null, data.videos);
    });
}

function sortVideos(videos, limit, callback) {
    limit = limit || videos.length;
    videos = _.sortBy(videos, function(video){ return Number(video.votes.total);});
    videos = _.last(videos, limit);

    return callback(null, videos.reverse());
}

function buildModel(videos, req, saveModel, callback){
    var model = {videos: videos};
    if(saveModel) {
        req.session.model = model;
    }
   return callback(null, model);
}

function sendView(res, view, callback){
    res.send(view);
    callback(null, 'success');
}

function renderSend(template, model, res, callback){
    res.render(template, model, function(err, view) {
        sendView(res, view, callback);
    });
}

function filterArtist(artists, filter) {
    var result = false;
    _.each(artists, function (artist){
        if(S(artist.name.toLowerCase()).contains(filter)) {
            result = true;
        }
    });

    return result;
}

module.exports = {
    loadVideos: loadVideos,
    sortVideos: sortVideos,
    buildModel: buildModel,
    renderSend: renderSend,
    filterArtist: filterArtist
};
