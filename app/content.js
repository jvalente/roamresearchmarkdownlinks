document.addEventListener('paste', (event) => {
    const element = event.target

    let text = (event.clipboardData || window.clipboardData).getData('text')

    if (validURL(text)) {
        event.preventDefault()
        chrome.runtime.sendMessage({url: text}, (response) => {
            if (response.length > 0) {
                text = `[${response[0].title}](${text}${text.endsWith('/') ? ') ' : ')'}`
            }

            insertText(element, text)
        })
    }
})

function validURL(str) {
    try {
        // Chrome considers standalone hashtags to be valid URL objects.
        // However, we don't want to query tabs with this (hashtags not
        // being a valid URL for querying tabs).
        if (str.startsWith('#'))
            return false

        new URL(str)
    } catch (_) {
        return false
    }

    return true
}

function insertText(element, text) {
    const start = element.selectionStart
    const end = element.selectionEnd
    const previous_text = element.value
    const before = previous_text.substring(0, start)
    const after  = previous_text.substring(end, previous_text.length)
    const event = new Event('input', {bubbles: true})

    element.value = before + text + after
    element.selectionStart = element.selectionEnd = start + text.length
    element.focus()
    element.dispatchEvent(event)
}
