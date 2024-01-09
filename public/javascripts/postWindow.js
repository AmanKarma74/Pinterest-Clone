/* <--------------------------------------- Image Window Card ------------------------------------------------> */
document.addEventListener("DOMContentLoaded", function() {
    
    const postWindow = document.querySelector(".window-container")
    const closeBtn = document.querySelector(".closeWindow")
    const visitUserProfile = document.querySelector('.visitUserProfile')
    const windowProfile = document.querySelector('.windowUser .window-profile .window-profile-img')
    const postImages = document.querySelectorAll(".image-card .images")
    
    const windowUsername = document.querySelector(".window-card .window-username")
    const windowImage = document.querySelector(".window-card .window-image")
    const likesNum = document.querySelector(".window-card .likecount")
    const windowTitle = document.querySelector(".window-card .window-title")
    
    const savebtn = document.querySelector(".window-card .windowsavebtn")
    const likebtn = document.querySelector(".window-card .windowlikebtn")
    const deletebtn = document.querySelector(".window-card .windowdeletebtn")
    
    postImages.forEach(Images => {
        Images.addEventListener('click', openWindow)
    });
    closeBtn.addEventListener('click', closeWindow)
    


    function openWindow(event) {
        const postSrc = event.target.getAttribute('src')
        const userProfilePic = event.target.getAttribute('userProfilePic')
        const postTitle = event.target.getAttribute('title')
        const username = event.target.getAttribute('username')
        const postId = event.target.getAttribute('postId')
        const postUserId = event.target.getAttribute('postUserId')
        const userId = event.target.getAttribute('userId')
        const likedby = event.target.getAttribute('likedby')
        const likecount = event.target.getAttribute('likecount')
        const savedpost = event.target.getAttribute('savedpost')
        
        if(likecount > 0){
            likesNum.textContent= likecount + ' likes'
        }
        
        const isliked = likedby.includes(userId)
        if(isliked){
            likebtn.classList.remove('ri-heart-line');
            likebtn.classList.add('ri-heart-fill');
        }else{
            likebtn.classList.remove('ri-heart-fill');
            likebtn.classList.add('ri-heart-line');
        }

        const issaved = savedpost.includes(postId)
        if(issaved){
            savebtn.classList.remove('ri-bookmark-line');
            savebtn.classList.add('ri-bookmark-fill');
        }else{
            savebtn.classList.remove('ri-bookmark-fill');
            savebtn.classList.add('ri-bookmark-line');
        }
        console.log(postUserId)
        console.log(userId)

        if(postUserId!=userId){
            deletebtn.style.display = 'none'
        }

        

        const savevalue = "savePost("+"'"+ postId + "'" + ")"
        const likevalue = "likePost("+"'"+ postId + "'" + ")"
        const deletevalue = "deletePost("+"'"+ postId + "'" + ")"
        savebtn.setAttribute('onclick', savevalue )
        likebtn.setAttribute('onclick', likevalue )
        deletebtn.setAttribute('onclick', deletevalue )


        postWindow.style.left = `${window.scrollX}px`
        postWindow.style.top = `${window.scrollY}px`
        postWindow.style.display = 'flex'
        document.body.style.overflow = 'hidden'

        windowUsername.textContent = username;
        windowImage.src = postSrc;
        windowProfile.src = userProfilePic;
        windowTitle.textContent = postTitle;
        visitUserProfile.href = '/profile/feed/' + username;
            
    }

    function closeWindow(){
        postWindow.style.display = 'none'
        document.body.style.overflow = 'auto'
    }
    
    
})

/* <--------------------------------------- SAVE POST ------------------------------------------------> */

async function savePost(postId){
    try{
        const response = await fetch('http://localhost:3000/savepost', {
            method: 'POST' ,
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({postId}),
        });
    }
    catch(error){
        console.log(error)
    }
}
async function likePost(postId){
    try{
        const response = await fetch('http://localhost:3000/likepost', {
            method: 'POST' ,
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({postId})
        });
        
    }
    catch(error){
        console.log(error)
    }
}
async function deletePost(postId){
    try{
        const response = await fetch('http://localhost:3000/deletepost', {
            method: 'POST' ,
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({postId})
        });
        
    }
    catch(error){
        console.log(error)
    }
}







