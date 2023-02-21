const allLikeButtons = document.querySelectorAll('.btn-like');
const allUnlikeButtons = document.querySelectorAll('.btn-unlike');
const allFollowButtons = document.querySelectorAll('.btn-follow');
const allUnfollowButtons = document.querySelectorAll('.btn-unfollow');

const apiBaseUrl = '/api';

for (const likeButton of allLikeButtons) {
    likeButton.addEventListener('click', likePost);
}

for (const unlikeButton of allUnfollowButtons) {
    unlikeButton.addEventListener('click', unlikePost);
}

for (const followButton of allFollowButtons) {
    followButton.addEventListener('click', followUser);
}

for (const unfollowButton of allUnfollowButtons) {
    unfollowButton.addEventListener('click', unfollowUser);
}

async function likePost(event) {
    const postId = event.target.closest('.post').dataset.id;
    const url = `${apiBaseUrl}/like/${postId}`;
    const response = await axios.post(url);
    if (response.status === 201) {

    } else {
        console.log('Error while liking Post:', response.data.errorMessage)
    }
    
}

async function unlikePost(event) {
    const postId = event.target.closest('.post').dataset.id;
    const url = `${apiBaseUrl}/like/${postId}`;
    const response = await axios.delete(url);
    console.log(response.data);}

async function followUser(event) {
    const authorId = event.target.closest('.post').dataset.author;
    const url = `${apiBaseUrl}/follow/${authorId}`;
    const response = await axios.post(url);
    console.log(response.data);}

async function unfollowUser(event) {
    const authorId = event.target.closest('.post').dataset.author;
    const url = `${apiBaseUrl}/follow/${authorId}`;
    const response = await axios.delete(url);
    console.log(response.data);}