
let model
let isActive = false

function handleMessages (message,sender,sendResponse) {
    if (message.action == "ON"){
        isActive = true
    }else if (message.action == "OFF") {isActive = false}

}

async function Classify (){
    if (isActive){
    let isNSFW =  false
    let frame = document.querySelector ('video')
    let canvaELEM = document.createElement ('canvas')
    canvaELEM.width = frame.videoWidth
    canvaELEM.height = frame.videoHeight
    let context = canvaELEM.getContext ('2d')
    context.drawImage (frame, 0,0)
    const predictions = await model.classify(canvaELEM);
    predictions.forEach(prediction => {
        if ((prediction.className == "Porn" && prediction.probability >= 0.7721698880195618) || 
            (prediction.className == "Hentai" && prediction.probability >= 0.5) ||
            (prediction.className == "Sexy" && prediction.probability >= 0.5)){
            isNSFW = true
        }
        console.log (predictions)
    })
    if (isNSFW){
       frame.style.filter = "blur(70px)"
    }else {frame.style.filter = "none"}}
}
async function init (){
    model = await nsfwjs.load(chrome.runtime.getURL('model/'))
    setInterval(Classify, 300)
    }

init ()
chrome.runtime.onMessage.addListener (handleMessages);


 


