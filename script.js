'use strict';

var buttons = document.getElementById('watch-like-dislike-buttons');

if (buttons) {
  var likeButtonClicked = buttons.getElementsByClassName('like-button-renderer-like-button-clicked')[0];
  var likeButtonUnclicked = buttons.getElementsByClassName('like-button-renderer-like-button-unclicked')[0];
  var dislikeButtonClicked = buttons.getElementsByClassName('like-button-renderer-dislike-button-clicked')[0];
  var dislikeButtonUnclicked = buttons.getElementsByClassName('like-button-renderer-dislike-button-unclicked')[0];

  var getFullCount = function(element) {
    return parseInt(element.getAttribute('aria-label').match(/[\d,]+/)[0].replace(/,/g, ''), 10);
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

  // These counts will not include your like/dislike
  var likes = getFullCount(likeButtonUnclicked);
  var dislikes = getFullCount(dislikeButtonUnclicked);

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
}
