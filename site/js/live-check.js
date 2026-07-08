// Watch-page live detection. YouTube's live_stream embed shows a jarring
// "Video unavailable" error whenever the channel is offline, so the player
// stays hidden until an actual live stream is confirmed. The page re-checks
// every minute (and immediately when a hidden tab becomes visible again), so
// visitors who arrive before the stream starts see the player appear without
// refreshing. Checking stops once revealed, or after 3 hours for parked tabs.
(function () {
  var wrap = document.getElementById('live-wrap');
  var offline = document.getElementById('live-offline');
  if (!wrap || !offline) return;

  var CHANNEL = 'UCzvTHbLCrNOadRYDHbtL59g';
  var POLL_MS = 60 * 1000;
  var MAX_MS = 3 * 60 * 60 * 1000;
  var startedAt = Date.now();
  var revealed = false;
  var checking = false;
  var player = null;
  var timer = null;

  function reveal() {
    if (revealed) return;
    revealed = true;
    if (timer) clearTimeout(timer);
    wrap.hidden = false;
    offline.hidden = true;
  }

  function schedule() {
    if (revealed || Date.now() - startedAt > MAX_MS) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(check, POLL_MS);
  }

  function check() {
    if (revealed || checking) return;
    if (typeof YT === 'undefined' || !YT.Player) { schedule(); return; }
    checking = true;

    if (player) { try { player.destroy(); } catch (e) {} player = null; }
    wrap.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/live_stream?channel=' + CHANNEL + '&enablejsapi=1';
    iframe.title = 'RCCG SCONA TV Live Stream';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);

    var errored = false;
    player = new YT.Player(iframe, {
      events: {
        onError: function () {
          errored = true;
          checking = false;
          schedule();
        },
        onReady: function (e) {
          setTimeout(function () {
            checking = false;
            if (errored || revealed) return;
            var d = e.target.getVideoData && e.target.getVideoData();
            if (d && d.video_id) reveal(); else schedule();
          }, 1500);
        },
        onStateChange: function (e) {
          if (errored || revealed) return;
          if (e.data === YT.PlayerState.PLAYING ||
              e.data === YT.PlayerState.BUFFERING ||
              e.data === YT.PlayerState.CUED) {
            var d = e.target.getVideoData && e.target.getVideoData();
            if (d && d.video_id) reveal();
          }
        }
      }
    });
  }

  // Returning to a backgrounded tab: check right away instead of waiting
  // out the timer (browsers throttle timers in hidden tabs anyway).
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !revealed) {
      if (timer) clearTimeout(timer);
      check();
    }
  });

  window.onYouTubeIframeAPIReady = function () { check(); };

  var s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
})();
