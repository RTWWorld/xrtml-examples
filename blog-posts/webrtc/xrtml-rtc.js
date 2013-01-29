/**
* Resources:
* - http://www.xrtml.org/articles/xrtml_webrtc.html
* - http://www.html5rocks.com/en/tutorials/webrtc/basics/
* - http://www.html5rocks.com/en/tutorials/getusermedia/intro/
* - http://www.w3.org/TR/webrtc/
*/
xRTML.TagManager.register({
    name: "webrtc",
    struct: function () {
        var proxy = xRTML.Common.Function.proxy,
        // used to communicate streams of data.
        PeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection,
        // configuration information according to the structure of SDP (Session Description Protocol).
		SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription,
        // ICE is a framework for connecting peers, such as two video chat clients.
		IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate,
		URL = window.webkitURL || window.URL;
        // provides access to the computers camera and microphone without the need of any plugins. 
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;

        // Set up audio and video regardless of what devices are present.
        var mediaConstraints = {
            'mandatory': {
                'OfferToReceiveAudio': true,
                'OfferToReceiveVideo': true
            }
        },

        peerConnection,

        // creates a peer connection.
        createPeerConnection = function () {
            try {
                peerConnection = new PeerConnection({ "iceServers": [{ "url": "stun:stun.l.google.com:19302"}] });

            } catch (e) {
                xRTML.Console.error("RTC tag: Failed to create PeerConnection, exception: ");
                throw e;
            }
            peerConnection.onicecandidate = proxy(onIceCandidate, this);
            peerConnection.onaddstream = proxy(onAddRemoteStream, this);
        },

        // whenever a peer starts
        onIceCandidate = function (e) {
            // if (global.stopSendingICE || !event.candidate || !peerConnection) return;

            if (e.candidate) {
                this.fire({
                    iceCandidate: {
                        label: e.candidate.sdpMLineIndex,
                        id: e.candidate.sdpMid,
                        candidate: e.candidate.candidate
                    }
                });
            }
        },

        // adds the stream from the remote peer
		onAddRemoteStream = function (e) {
		    if (e) {
		        var url = URL.createObjectURL(e.stream);
		        this.remoteStream.url(URL.createObjectURL(e.stream));
		        this.remoteStream.stream = e.stream;
		        xRTML.Console.debug("Remote peer is streaming.");
		        // peerConnection.addStream(this.remoteStream.stream);
		    }
		},

        // logs exceptions that might occur during the call process.
        errorHandler = function (error) {
            xRTML.Console.error("Error:");
            xRTML.Console.error(error);
        };

        this.init = function (tagObject) {
            this._super(tagObject);

            // holds the actions the local user can perform.
            this.model = {
                // information about the local user's camera.
                localStream: {
                    stream: null,
                    url: xRTML.Templating.observable("")
                },
                // information about the remote user's camera.
                remoteStream: {
                    stream: null,
                    url: xRTML.Templating.observable("")
                },
                // starts locally streaming video from your camera.
                start: function () {
                    if (!peerConnection) createPeerConnection.call(this);
                    var constraints = { "mandatory": {}, "optional": [] };
                    // allows web apps to access a user's camera and microphone (LocalMediaStream).
                    navigator.getUserMedia(
					    { audio: true, video: constraints },
					    proxy(function (localMediaStream) {
					        // converts a LocalMediaStream to a Blob URL and adds it to the src of the video element.
					        this.localStream.url(URL.createObjectURL(localMediaStream));
					        this.localStream.stream = localMediaStream;
					        // add the local stream to the peer connection.
					        peerConnection.addStream(localMediaStream);
					    }, this),
					    proxy(errorHandler, this)
                    );
                },
                // initiates a call request by creating a SessionDescription known as 'offer'.
                call: function () {
                    if (!peerConnection) this.start();
                    peerConnection.createOffer(
                        proxy(function (sessionDescription) {
                            // Passes the local users session description to his browser and delegates to the tag the task to send the session description to the remote peer (callee).
                            peerConnection.setLocalDescription(sessionDescription)
                            this.fire({ call: { sessionDescription: sessionDescription } });
                        }, this),
                        proxy(errorHandler, this),
                        mediaConstraints);
                },
                // creates an answer by creating and setting the local session description and replying to the caller's offer request with it.
                answer: function () {
                    peerConnection.createAnswer(
                        proxy(function (sessionDescription) {
                            // Passes the local users session description to his browser.
                            peerConnection.setLocalDescription(sessionDescription);
                            // Delegates to the tag the task of sending the session description to the remote peer (caller).
                            this.fire({ answer: { sessionDescription: sessionDescription } });
                        }, this),
                        proxy(errorHandler, this),
                        mediaConstraints);
                },
                // closes the local media stream and removes the remote stream of the other peer.
                hangup: function () {
                    if (this.localStream.stream) {
                        peerConnection.removeStream(this.localStream.stream);
                        // removes the local video stream from the page.
                        this.localStream.url("");
                        this.localStream.stream = null;
                        // removes the remote video stream from the page.
                        this.remoteStream.url("");
                        this.remoteStream.stream = null;
                        // Delegates to the tag the task of signaling the end of the conversation.
                        this.fire({ hangup: {} });
                    }
                }
            };
            xRTML.Event.extend(this.model);

            // delegation to the tag of the local user interactions with the model.
            this.model.bind({
                iceCandidate: proxy(function (e) {
                    this.sendMessage({
                        action: "candidate",
                        data: {
                            label: e.label,
                            id: e.id,
                            candidate: e.candidate
                        }
                    });
                }, this),

                // send the local description of the caller (local user) to the callee (remote user).
                call: proxy(function (e) {
                    this.sendMessage({
                        action: "call",
                        data: { sessionDescription: e.sessionDescription }
                    });
                }, this),

                // send the local description of the callee (local user) to the caller (remote user). In this case, after receiving an offer.
                answer: proxy(function (e) {
                    this.sendMessage({
                        action: "answer",
                        data: { sessionDescription: e.sessionDescription }
                    });
                }, this),
                // send a message signaling the end of the call.
                hangup: proxy(function (e) {
                    this.sendMessage({
                        action: "hangup",
                        data: {}
                    });
                    // clear the remote stream
                    this.hangup();
                }, this)
            });

            this.templates = tagObject.templates;

            xRTML.Templating.applyBindings({
                node: xRTML.Sizzle(this.templates.localStream.target)[0],
                binding: {
                    template:
					{
					    name: this.templates.localStream.id,
					    data: this.model
					}
                }
            });

            xRTML.Templating.applyBindings({
                node: xRTML.Sizzle(this.templates.remoteStream.target)[0],
                binding: {
                    template:
					{
					    name: this.templates.remoteStream.id,
					    data: this.model
					}
                }
            });
        };

        this.candidate = function (message) {
            var candidate = new IceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            peerConnection.addIceCandidate(candidate);
        };

        // Action called when a remote peer issues a call.
        this.call = function (message) {
            // Add the caller's session description and initiate a response (answer the call).
            peerConnection.setRemoteDescription(new SessionDescription(message.sessionDescription), proxy(function () {
                if (peerConnection.remoteDescription.type == "offer") {
                    this.model.answer();
                }
            }, this));

        };

        // Action called whenever a remote peer issues a reply to a call.
        this.answer = function (message) {
            // Add the callee's session description.
            peerConnection.setRemoteDescription(new SessionDescription(message.sessionDescription), proxy(function () {
                if (peerConnection.remoteDescription.type == "answer") {
                }
            }, this));
        };

        // closes the stream of the remote peer.
        this.hangup = function (message) {
            if (this.model.remoteStream.stream) {
                peerConnection.removeStream(this.model.remoteStream.stream); // THIS MIGHT NOT BE NEEDED.
                this.model.remoteStream.url("");
                this.model.remoteStream.stream = null;
            }
        };
    }
});