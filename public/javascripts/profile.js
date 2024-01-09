/* <--------------------------------------- POST UPLOAD FORM ------------------------------------------------> */

function openUploadForm() {
    document.getElementById("uploadForm").style.display = "block";
}

function closeUploadForm() {
    document.getElementById("uploadForm").style.display = "none";
}


document.querySelector("#lower-bg .profileicon").addEventListener("click", function() {
    document.querySelector("#profileform input").click()
});
document.querySelector("#profileform input").addEventListener("change", function() {
    document.querySelector("#profileform").submit()
});

function toggle(containerId){
    document.querySelectorAll('.mypost-container, .savedpost-container').forEach(container => {
        container.classList.remove('active');
    })
    document.getElementById(containerId).classList.add('active');
    
    document.querySelectorAll('.switch-card .myposts, .switch-card .savedposts').forEach(button => {
        button.classList.remove('focus');
    })
    if(containerId=='mypost-container'){
        document.querySelector('.switch-card .myposts').classList.add('focus');
    }else{
        document.querySelector('.switch-card .savedposts').classList.add('focus');
    }
}