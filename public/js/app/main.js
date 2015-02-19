"use strict";
define(["jquery", "jQueryDebounce"], function ($, jQueryDebounce) {
    $(document).ready(function () {
        RegisterVoteCounting();
        RegisterFiltering();
        RegisterEmbedVideo();
    });

    function checkVotesRanking(self, rowPrev, rowCurrent, rowNext) {
        var vote_count = rowCurrent.find('.vote-count');
        var nextCount = rowNext.find('.vote-count');
        var prevCount = rowPrev.find('.vote-count');

        if ($(prevCount).size() > 0 && Number($.trim(vote_count.text())) > Number($.trim(prevCount.text()))) {
            $(rowPrev).before($(rowCurrent));
        }

        if ($(nextCount).size() > 0 && Number($.trim(vote_count.text())) < Number($.trim(nextCount.text()))) {
            $(rowCurrent).before($(rowNext));
        }
    }

    function addVote() {
        changeVotes(this, 1);
    }

    function subtractVote() {
        changeVotes(this, -1);
    }

    function changeVotes(self, unit) {
        try {
            var rowCurrent = $(self).closest('.row');
            var rowNext = $(self).closest('.row').next('.row');
            var rowPrev = $(self).closest('.row').prev('.row');

            var voteCount = rowCurrent.find('.vote-count');
            var videoId = rowCurrent.attr('id');
            var onlyIncrease = rowCurrent.find('.only-increase');

            voteCount.text(Number(voteCount.text()) + unit);

            if ($(onlyIncrease).size() > 0 && unit > 0) {
                DecreaseOn(onlyIncrease);
            }

            if (Number(voteCount.text()) <= 0) {
                DecreaseOff(this);
            }

            checkVotesRanking(this, rowPrev, rowCurrent, rowNext);
            putVote(videoId, unit);
        } catch (err) {
            console.log(err);
        }
    }

    function filterVideos() {
        var filter = $('.form-control').val();
        if (filter.trim().length > 0) {
            $.get("videos/" + filter, function (data) {
                $('.videoList').html(data);
                RegisterVoteCounting();
                RegisterEmbedVideo();
            });
        } else {
            $.ajax({
                url: "videos/",
                data: {partial: 1}
            }).done(
                function (data) {
                    $('.videoList').html(data);
                    RegisterVoteCounting();
                    RegisterEmbedVideo();
                });
        }
    }

    function putVote(videoId, unit) {
        $.ajax({
            url: "videos/" + videoId,
            type: "PUT",
            data: {unit: unit}
        }).done(
            function (data) {
            });
    }

    function embedVideo(){
        var key = $(this).closest('.row').attr('id');
        var self = this;

        $.get("video/" + key, function (data) {
            var currentRow = $(self).closest('.row');
            var thumb = currentRow.find('.video-thumb');
            $(thumb).html("<a class='embedly-card' href='http://www.vevo.com/watch/" + data.isrc + "'>Loading...</a>")
        });
    }

    function DecreaseOn(onlyIncrease) {
        var onlyIncreaseNode = $(onlyIncrease).get(0);
        $(onlyIncreaseNode).removeClass("only-increase");
        $(onlyIncreaseNode).addClass("decrease-vote");
        $(onlyIncreaseNode).on("click", subtractVote);
    }

    function DecreaseOff(self) {
        $(self).removeClass("decrease-vote").addClass("only-increase");
        $(self).off("click", subtractVote);
    }

    function RegisterVoteCounting() {
        $('.decrease-vote').on('click', subtractVote);
        $('.increase-vote').on('click', addVote);
    }

    function RegisterFiltering() {
        $('.form-control').on('keyup', $.debounce(filterVideos, 1000, false));
    }

    function RegisterEmbedVideo() {
        $('.video-thumb').on('click', embedVideo);
    }
});