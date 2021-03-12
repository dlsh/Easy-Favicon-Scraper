/* 
    Listens for a click on the browser button
*/

browser.browserAction.onClicked.addListener((tab) => {
    main(tab);
});

function main(currTab) {
    downloadIcon(currTab.favIconUrl);
}


function dataURLtoBlob(dataurl) {
    // Split entire data url into 2
    let arr = dataurl.split(',');

    // matches for portion in-between : and ;
    let mime = arr[0].match(/:(.*?);/)[1];
    
    // decode base-64
    let binarystr = atob(arr[1]);
    let n = binarystr.length;

    // recode as utf-8
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = binarystr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

/*
    Downloads favicon of current tab
*/ 
function downloadIcon(dataUrl) {

    let dataBlob = dataURLtoBlob(dataUrl);

    const downloadUrl = URL.createObjectURL(dataBlob);

    const options = {
        url: downloadUrl,
        filename: 'favicon.ico',
        saveAs: true
    }

    let downloading = browser.downloads.download(options);

    downloading.then((id) => downloadStartSuccess(id, downloadUrl), downloadFail);
}

/*
    Logging functions for download function
*/
function downloadStartSuccess(id, downloadUrl) {
    console.log(`Started downloading: ${id}`);
    // Revokes created object url
    revokeUrl(id, downloadUrl);
}
  
function downloadFail(error) {
    console.log(`Download failed: ${error}`);
}

/*
    Creates a listener for download changes.
    Only revokes if there is a match.
*/ 
function revokeUrl (id, downloadUrl) {
    browser.downloads.onChanged.addListener((downloadItem) => {
        if (downloadItem.id == id && downloadItem.state.current == "complete") {
            URL.revokeObjectURL(downloadUrl);
            console.log("revoked");
        }
    });
}