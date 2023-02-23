/**
 * createTagInput.js
 * Adds functionality to add new tag input elements when creating or updating a post
 */

document.querySelector('#newTagBtn').addEventListener("click", () => {
    const newInput = document.createElement('input')
    newInput.setAttribute('name', 'tag')
    newInput.placeholder = 'Tag'
    document.getElementById('tagContainer').append(newInput)
})