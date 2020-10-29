chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        chrome.tabs.query({url: request.url}, (tabs) => {
            if (tabs.length == 0) {
                chrome.tabs.query({url: request.url.replace(/#.*$/, '')}, (tabs) => {
                    return sendResponse(tabs)
                })
            } else {
                return sendResponse(tabs)
            }
        })

        return true
    }
)