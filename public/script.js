const videoGrid = document.getElementById('video-grid');
const video = document.createElement('video');
let peer;
let peers = {};

async function playVideo() {
    let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    video.muted = true;
    addVideoStream(video, mediaStream);

    peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: '3000'
    });


    peer.on('call', call => {
        call.answer(mediaStream);
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', (userId) => {
        connToNewUser(userId, mediaStream);        
    });

    socket.on('user-disconnected', (userId) => {
        if(peers[userId])    peers[userId].close();
    });

    
    
    peer.on('open', (id) => {
        socket.emit('join-room', ROOM_ID, id);
    });   
}

const connToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
    peers[userId] = call;
};

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();    
    });
    videoGrid.append(video);
}

playVideo();