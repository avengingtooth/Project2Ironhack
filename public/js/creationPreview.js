function markdownParsing(content, loc){
    let newLine
    content.trim()
    if(content[0] == '#'){
        newLine = document.createElement('md-block')
        newLine.hmin = "3"
    }
    else{
        newLine = document.createElement('md-span')
    }
    newLine.classList.add('mdLine')
    newLine.textContent = content
    let contentContainer = document.querySelectorAll(loc)
    contentContainer[contentContainer.length-1].append(newLine)
}

function removeAllChildren(node){
    while(node.firstChild){
        node.removeChild(node.lastChild)
    }
}

//title preview
document.querySelector('.createTitle').addEventListener('input', () => {
    let previewTitle = document.querySelector('.previewTitle')
    let creationTitle = document.querySelector('.createTitle').value
    previewTitle.textContent  = creationTitle
})

//content preview
document.querySelector('.createContent').addEventListener('input', () => {
    let loc = '.previewContent'
    
    removeAllChildren(document.querySelector(loc))

    let creationContent = document.querySelector('.createContent').value
    creationContent = creationContent.split('\n')

    creationContent.forEach(element => {
        markdownParsing(element, loc)
    })
})

//tags preview
document.querySelector('.allTags').addEventListener('input', () => {
    removeAllChildren(document.querySelector('#previewTags'))

    let tagContainer = document.querySelector('#previewTags')
    let allTagElements = document.querySelectorAll('.allTags input')
    allTagElements.forEach(tag => {
        let newTag = document.createElement('a')
        newTag.classList.add('post-tag')
        newTag.textContent = tag.value
        tagContainer.append(newTag)
    })
    // <a class="post-tag" href="">{{name}}</a>
})
