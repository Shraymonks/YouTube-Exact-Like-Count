'use strict';

var API_KEY = 'YOUR API KEY';

var getExactCount = function(element) {
  var label = element.getAttribute('aria-label');
  if (!label) return null;

  // Get count from label
  var results = label.match(/[\d,]+/);
  return results ? parseInt(results[0].replace(/,/g, ''), 10) : null;
};

var getVideoId = function() {
  var results = location.search.match(/[\\?&]v=([^&#]*)/);
  return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
};

var isHidden = function(element) {
  return element.classList.contains('yt-uix-tooltip.hid');
};

var getTextNode = function(element) {
  return element.children[0].childNodes[0];
};

// Print count with commas
var renderCount = function(count) {
  return count.toLocaleString('en');
};

var displayExactCounts = function() {
  var buttons = document.getElementById('watch-like-dislike-buttons');

  if (buttons) {
    var likeButtonClicked = buttons.getElementsByClassName('like-button-renderer-like-button-clicked')[0];
    var likeButtonUnclicked = buttons.getElementsByClassName('like-button-renderer-like-button-unclicked')[0];
    var dislikeButtonClicked = buttons.getElementsByClassName('like-button-renderer-dislike-button-clicked')[0];
    var dislikeButtonUnclicked = buttons.getElementsByClassName('like-button-renderer-dislike-button-unclicked')[0];

    var likes = getExactCount(likeButtonUnclicked);
    var dislikes = getExactCount(dislikeButtonUnclicked);

    var renderCounts = function() {
      // Subtract your likes/dislikes
      if (isHidden(likeButtonUnclicked)) {
        likes--;
      }
      if (isHidden(dislikeButtonUnclicked)) {
        dislikes--;
      }

      getTextNode(likeButtonUnclicked).nodeValue = renderCount(likes);
      getTextNode(likeButtonClicked).nodeValue = renderCount(likes + 1);
      getTextNode(dislikeButtonUnclicked).nodeValue = renderCount(dislikes);
      getTextNode(dislikeButtonClicked).nodeValue = renderCount(dislikes + 1);
    };

    if (likes != null) {
      renderCounts();
    }
    // Fallback to YouTube API if the aria-label is ever removed
    else {
      var request = new XMLHttpRequest();
      request.addEventListener('load', function() {
        var response = JSON.parse(this.responseText);
        var statistics = response.items[0].statistics;

        likes = parseInt(statistics.likeCount, 10);
        dislikes = parseInt(statistics.dislikeCount, 10);

        renderCounts();
      });

      request.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' + getVideoId() + '&key=' + API_KEY, true);
      request.send();
    }
  }
};
displayExactCounts();

// Update the count whenever a new video is played
// Clicking on a new video link loads the video in dynamically
// `#content`'s children is observed for mutations to detect a different video is being viewed
var observer = new MutationObserver(displayExactCounts);
observer.observe(document.getElementById('content'), {childList: true});
