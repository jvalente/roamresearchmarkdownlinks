document.addEventListener('paste', (event) => {
    let text = (event.clipboardData || window.clipboardData).getData('text')

    if (validURL(text))
    {
        chrome.runtime.sendMessage({url: text}, (response) => {
            if (response.length > 0) {
                text = `[${response[0].title}](${text}${text.endsWith('/') ? ') ' : ')'}`
            }

            window.document.execCommand('insertText', false, text)
        })

        event.preventDefault()
    }
})

function validURL(str) {
    try {
        new URL(str)
    } catch (_) {
        return false
    }

    return true
}