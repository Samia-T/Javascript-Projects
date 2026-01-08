const videoElem = document.getElementById('video');
const button = document.getElementById('button');

// prompt user to select media stream, pass to videlem, play
async function selectMediaStream() {
    try{
        const mediaStream = await navigator.mediaDevices.getDisplayMedia();
        videoElem.srcObject = mediaStream;
        videoElem.onloadedmetadata = () => {
            videoElem.play();
        }
    } catch (err) {
        console.log('whoops, error here:', err);
    } 
}

button.addEventListener('click', async () => {
    button.disabled = true;
    // start pic in pic
    await videoElem.requestPictureInPicture();
    button.disabled = false;
})

selectMediaStream();