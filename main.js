//JavaScript get LAN+WAN IP
//
/////////////////////////////////////
//	run_webrtc_check(console.log)  //
//	undefined				       //
//	192.168.1.100                  //
//	182.138.215.173			       //
/////////////////////////////////////

function networkCheck(callback) {
    var ip_arr = {};
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;
    if (!RTCPeerConnection) {
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }
    var mediaConstraints = {
        optional: [{
            RtpDataChannels: true
        }]
    };
    var servers = undefined;
    servers = {
        iceServers: [{
            urls: "stun:stun.ekiga.net:3478" //stun server
        }]
    };
    var pc = new RTCPeerConnection(servers, mediaConstraints);
    function handleCandidate(candidate) {
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        var ip_addr = ip_regex.exec(candidate)[1];
        if (ip_arr[ip_addr] === undefined) callback(ip_addr); //callback
        ip_arr[ip_addr] = true;
    }
    pc.onicecandidate = function(ice) {
        if (ice.candidate) handleCandidate(ice.candidate.candidate);
    };
    pc.createDataChannel("");
    pc.createOffer(function(result) {
        pc.setLocalDescription(result,
        function() {},
        function() {});
    },
    function() {});
    setTimeout(function() {
        var lines = pc.localDescription.sdp.split('\n');
        lines.forEach(function(line) {
            if (line.indexOf('a=candidate:') === 0) handleCandidate(line);
        });
    },
    1000);
}
