import markdownParsing from '/js/markdownParsing.js'

//title preview
document.querySelector('.title').addEventListener('input', () => {
    let previewTitle = document.querySelector('.previewTitle')
    let creationTitle = document.querySelector('.title')
    previewTitle.textContent = creationTitle.value
})

//content preview
document.querySelector('.content').addEventListener('input', () => {
    let previewContent = document.querySelector('.previewContent')
    let creationContent = document.querySelector('.content').value
    
    creationContent = creationContent.split('\n\r')
    console.log('asdf')
    markdownParsing(creationContent, '.previewContent')

    previewContent.textContent = creationContent
})