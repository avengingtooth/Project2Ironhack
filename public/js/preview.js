/**
 * preview.js
 * Used to immediately display selected image files on the page, before user even uploads them
 */

// code based on an example found on stack overflow, but adjusted for our needs:
// https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
const fileInput = document.querySelector('input[type="file"]');
const previewElement = document.querySelector('img#profile-picture-preview');

fileInput.addEventListener('change', (event)=>{
    const [file] = fileInput.files;
    if (file) {
        previewElement.setAttribute('src', URL.createObjectURL(file));
        previewElement.style.display = 'inline';
    }
});