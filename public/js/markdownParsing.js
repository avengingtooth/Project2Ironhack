function markdownParsing(previewElement, previewLoc){
    console.log('mark')
    let element
    if(previewElement){
        element = previewElement
    }
    else{
        element = document.querySelectorAll('.mdConverter')
    }

    let loc
    if(previewLoc){
        loc = previewLoc
    }
    else{
        loc = element[element.length - 1].getAttribute('loc')
    }

    let content = element[element.length - 1].getAttribute('content')
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
    contentContainer[contentContainer.length - 1].append(newLine)
}

// function markdownParsing(){
//     let element = document.querySelectorAll('.mdConverter')
//     let content = element[element.length - 1].getAttribute('content')
// }

// markdownParsing()

markdownParsing()

export default markdownParsing