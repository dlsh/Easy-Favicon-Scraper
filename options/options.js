
const whitePath = "../icons/icon-128-white.png"
const blackPath = "../icons/icon-128.png"

function setIconTheme() {
    let newValue = document.getElementById("icon_theme").value;

    if (newValue == "default") {
        browser.browserAction.setIcon({
            path: null
        });
    } else if (newValue == "white") {
        browser.browserAction.setIcon({
            path: whitePath
        });
    } else if (newValue == "black") {
        browser.browserAction.setIcon({
            path: blackPath
        });
    }

    browser.storage.sync.set({
        theme: newValue
    });
}

const currSettings = browser.storage.local.get();
console.log(currSettings)
if (currSettings.theme) {
    document.getElementById("icon_theme").value = currSettings.theme;
}

document.getElementById("icon_theme").addEventListener("change", setIconTheme);