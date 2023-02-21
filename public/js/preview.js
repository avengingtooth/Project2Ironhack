// code based on an example found on stack overflow while trying to search for a way to do this
// https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
const fileInput = document.querySelector('input[type="file"]');
const previewElement = document.querySelector('img#preview');

fileInput.addEventListener('change', (event)=>{
    const [file] = fileInput.files;
    if (file) {
        previewElement.setAttribute('src', URL.createObjectURL(file));
        previewElement.style.display = 'inline';
    }
});