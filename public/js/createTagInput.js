document.querySelector('#newTagBtn').addEventListener("click", () => {
    const newInput = document.createElement('input')
    newInput.setAttribute('name', 'tag')
    newInput.placeholder = 'Tag'
    document.getElementById('tagContainer').append(newInput)
})

