const toast = function ({
    type,
    icon,
    title,
    content }) {
    const main = document.querySelector('.toast-wrap');
    if (main) {

        const toast = document.createElement(`div`);
        main.appendChild(toast);
        toast.classList.add(`toast`, `toast--${type}`);

        const autoRemove = setTimeout(function(){
            main.removeChild(toast);
        },3000)

        toast.onclick = function(e){
            if(e.target.closest('.toast__close')){
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        }
        toast.innerHTML =
            `
    <div class="toast-icon">
    ${icon}
    </div>
    <div class="toast__body">
    <h3 class="toast__title">${title}</h3>
    <p class="toast_content">${content}</p>
    </div>
    <div class="toast__close">
    <i class="toast__close-icon fa-solid fa-xmark"></i>
    </div>
    `
    }

}

function showSuccessClick() {
    toast({
        type: 'success',
        icon: '<i class="fa-solid fa-circle-check"></i>',
        title: 'Success',
        content: 'You are clicked success',
    });
}

function showFailureClick() {
    toast({
        type: 'failure',
        icon: '<i class="fa-solid fa-circle-exclamation"></i>',
        title: 'Failure',
        content: 'You are clicked failure',
    });
}

// showSuccessClick();