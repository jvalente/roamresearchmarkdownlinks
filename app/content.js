document.addEventListener('paste', (event) => {
    const element = event.target

    let text = (event.clipboardData || window.clipboardData).getData('text')

    if (validURL(text) && !inMarkdownLink(element)) {
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
        new URL(str)
    } catch (_) {
        return false
    }

    return true
}

function inMarkdownLink(element) {
    const before_cursor = element.value.substring(0, element.selectionStart)
    const lastOpen = before_cursor.lastIndexOf('](')
    const lastClose = before_cursor.lastIndexOf(')')
    return lastOpen !== -1 && lastClose < lastOpen
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
