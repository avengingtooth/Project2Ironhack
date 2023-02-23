function markdownParsing(){
    let element = document.querySelectorAll('.mdConverter')
    let content = element[element.length - 1].getAttribute('content')
    let newLine
    content.trim()
    if(content[0] == '#'){
        newLine = document.createElement('md-block')
    }
    else{
        newLine = document.createElement('md-span')
    }
    newLine.classList.add('mdLine')
    newLine.textContent = content
    let contentContainer = document.querySelectorAll('.content')
    contentContainer[contentContainer.length - 1].append(newLine)
}

markdownParsing()