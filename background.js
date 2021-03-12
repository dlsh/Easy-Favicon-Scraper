/* 
    Listens for a click on the browser button
*/

browser.browserAction.onClicked.addListener((tab) => {
    main(tab);
});

function main(currTab) {
    downloadIcon(currTab.favIconUrl);
}


/*
    Downloads favicon of current tab
*/ 
function downloadIcon(dataUrl) {

    let dataBlob = dataURLtoBlob(dataUrl);
    console.log(dataUrl);

    const downloadUrl = URL.createObjectURL(dataBlob);

    const dataType = findFileType(dataUrl);

    const options = {
        url: downloadUrl,
        filename: 'favicon' + dataType,
        saveAs: true
    }

    let downloading = browser.downloads.download(options);

    downloading.then((id) => downloadStartSuccess(id, downloadUrl), downloadFail);
}

/*
    Helper functions
*/

function dataURLtoBlob(dataUrl) {
    // Split entire data url into 2
    let arr = dataUrl.split(',');

    // matches for portion in-between : and ;
    let mime = arr[0].match(/:(.*?);/)[1];

    // decode base-64
    let binaryStr = atob(arr[1]);
    let n = binaryStr.length;

    // recode as utf-8
    let u8Arr = new Uint8Array(n);

    while (n--) {
        u8Arr[n] = binaryStr.charCodeAt(n);
    }
    return new Blob([u8Arr], {type:mime});
}

function findFileType(dataUrl) {
    // Split entire data url into 2
    let arr = dataUrl.split(',');

    // match for image type only
    let imageType = arr[0].match(/\/(.*?);/)[1];

    if (imageType == "x-icon") {
        return ".ico";
    } else if (imageType == "svg+xml") {
        return ".svg";
    } else {
        return ".png";
    }
    
      
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