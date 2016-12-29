 // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
 youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

/* 
 YouTube Audio Embed 
 --------------------
 
 Author: Amit Agarwal
 Web: http://www.labnol.org/?p=26740 
*/
// Modified for use with another button

onYouTubeIframeAPIReady() {
    var e = document.getElementById("youtube-audio"),
//        t = document.createElement("img");
//    t.setAttribute("id", "youtube-icon"), t.style.cssText = "cursor:pointer;cursor:hand", e.appendChild(t);
    var a = document.createElement("div");
    a.setAttribute("id", "youtube-player"), e.appendChild(a);
    // var o = function(e) {
    //     var a = e ? "IDzX9gL.png" : "quyUPXN.png";
    //     t.setAttribute("src", "https://i.imgur.com/" + a)
    // };
    
    var r = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: e.dataset.video,
        playerVars: {
            autoplay: e.dataset.autoplay,
            loop: e.dataset.loop
        },
        events: {
            onReady: function(e) {
                r.setPlaybackQuality("small")//, o(r.getPlayerState() !== YT.PlayerState.CUED)
            }
            // ,
            // onStateChange: function(e) {
            //     e.data === YT.PlayerState.ENDED && o(!1)
            // }
        }
    })

    // return a callback for starting/stopping music
    return function() {
        (r.getPlayerState() === YT.PlayerState.PLAYING || r.getPlayerState() === YT.PlayerState.BUFFERING)
         	? r.pauseVideo() 
         	: r.playVideo()
    };
}