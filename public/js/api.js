/**
 * api.js
 * Frontend functions used to interact with the backend
 * implements the functionality for:
 *  - loading eisiting comments for all posts currently shown on the page
 *  - commenting on posts (and displaying/hiding the comments)
 *  - liking/unliking posts
 *  - following/unfollowing users
 */

const allLikeButtons = document.querySelectorAll('.btn-like');
const allUnlikeButtons = document.querySelectorAll('.btn-unlike');
const allFollowButtons = document.querySelectorAll('.btn-follow');
const allUnfollowButtons = document.querySelectorAll('.btn-unfollow');

const allcommentButtons = document.querySelectorAll('.btn-comments');
const allPosts = document.querySelectorAll('.post-container');

const apiBaseUrl = '/api';

// Set up for like/unlike buttons
for (const likeButton of allLikeButtons) {
    likeButton.addEventListener('click', likePost);
}

for (const unlikeButton of allUnlikeButtons) {
    unlikeButton.addEventListener('click', unlikePost);
}

// setup for follow/unfollow buttons
for (const followButton of allFollowButtons) {
    followButton.addEventListener('click', followUser);
}

for (const unfollowButton of allUnfollowButtons) {
    unfollowButton.addEventListener('click', unfollowUser);
}


// loop through all posts to fetch their comments and set up the posts event handler
for (const post of allPosts) {
    const postId = post.dataset.id;
    const url = `${apiBaseUrl}/comments/${postId}`;
    const commentContainer = post.querySelector('.comments-feed-container')
    const showCommentsButton = post.querySelector('.btn-comments');
    const postCommentButton = post.querySelector('.btn-new-comment');

    showCommentsButton.textContent = `Show ${post.dataset.commentCount} comment${post.dataset.commentCount == 1 ? '' : 's'}`;
    showCommentsButton.addEventListener('click', showComments);

    postCommentButton.addEventListener('click', postComment);

    try {
        const response = await axios.get(url);
        if (response.status === 201) {
            const comments = response.data.comments; // the api should return an array of 0 or more comments
            post.dataset.commentCount = comments.length;
            showCommentsButton.textContent = `Show ${post.dataset.commentCount} comment${post.dataset.commentCount == 1 ? '' : 's'}`;

            for (const comment of comments) {
                const commentDiv = buildCommentDiv(comment);
                commentContainer.appendChild(commentDiv);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// event handler functions
async function likePost(event) {
    const postId = event.target.closest('.post-container').dataset.id;
    const button = event.target;
    const url = `${apiBaseUrl}/like/${postId}`;
    try {
        console.log('trying to like')
        const response = await axios.post(url);
        if (response.status === 201) {
            console.log('like successful')
            button.removeEventListener('click', likePost);
            button.addEventListener('click', unlikePost);
            button.textContent = 'Unlike';
            button.classList.remove('btn-like');
            button.classList.add('btn-unlike');

        } else {
            console.log('Error while liking Post:', response.data.errorMessage)
        }
    } catch (error) {
        console.log('critical error while liking post', error)
    }
}

async function unlikePost(event) {
    const postId = event.target.closest('.post-container').dataset.id;
    const button = event.target;
    const url = `${apiBaseUrl}/like/${postId}`;
    try {
        const response = await axios.delete(url);
        if (response.status === 204) {
            console.log('unlike successful')
            button.removeEventListener('click', unlikePost);
            button.addEventListener('click', likePost);
            button.textContent = 'Like';
            button.classList.remove('btn-unlike');
            button.classList.add('btn-like');
        } else {
            console.log('Error while unliking Post:', response.data.errorMessage)
        }
    } catch (error) {
        console.log('critical error while unliking post', error)
    }
}

async function followUser(event) {
    const authorId = event.target.closest('.post-container').dataset.author;
    const url = `${apiBaseUrl}/follow/${authorId}`;
    try {
        const response = await axios.post(url);
        if (response.status === 201) {
            console.log('follow successful')
            const allPostsByThisAuthor = document.querySelectorAll(`[data-author="${authorId}"]`);
            for (const post of allPostsByThisAuthor) {
                const buttons = post.querySelectorAll('.follow-unfollow');
                for (const button of buttons) {
                    button.removeEventListener('click', followUser);
                    button.addEventListener('click', unfollowUser);
                    button.textContent = 'Unfollow';
                    button.classList.remove('btn-follow');
                    button.classList.add('btn-unfollow');
                }
            }
        } else {
            console.log('Error while following user:', response.data.errorMessage)
        }
    } catch (error) {
        console.log('critical error while following user', error)
    }
}

async function unfollowUser(event) {
    const authorId = event.target.closest('.post-container').dataset.author;
    const url = `${apiBaseUrl}/follow/${authorId}`;
    const button = event.target;

    try {
        const response = await axios.delete(url);
        if (response.status === 204) {
            console.log('unfollow successful')
            const allPostsByThisAuthor = document.querySelectorAll(`[data-author="${authorId}"]`);
            for (const post of allPostsByThisAuthor) {
                const buttons = post.querySelectorAll('.follow-unfollow');
                for (const button of buttons) {
                    button.removeEventListener('click', unfollowUser);
                    button.addEventListener('click', followUser);
                    button.textContent = 'Follow';
                    button.classList.remove('btn-unfollow');
                    button.classList.add('btn-follow');
                }
            }
        } else {
            console.log('Error while unfollowing user:', response.data.errorMessage)
        }
    } catch (error) {
        console.log('critical error while unfollowing user', error)
    }
}

function showComments(event) {
    const post = event.target.closest('.post-container');
    const commentContainer = post.querySelector('.comments-feed-container');
    const button = event.target;

    commentContainer.style.display = 'block';

    button.removeEventListener('click', showComments);
    button.textContent = `Hide comment${post.dataset.commentCount == 1 ? '' : 's'}`;
    button.addEventListener('click', hideComments);
}

function hideComments(event) {
    const post = event.target.closest('.post-container');
    const commentContainer = post.querySelector('.comments-feed-container');
    const button = event.target;

    commentContainer.style.display = 'none';

    button.removeEventListener('click', hideComments);
    button.textContent = `Show ${post.dataset.commentCount} comment${post.dataset.commentCount == 1 ? '' : 's'}`;
    button.addEventListener('click', showComments);
}

async function postComment(event) {
    event.preventDefault();

    const post = event.target.closest('.post-container');
    const commentContainer = post.querySelector('.comments-feed-container');
    const postId = post.dataset.id;
    const url = `${apiBaseUrl}/comments/${postId}`;
    const contentInput = post.querySelector('form > .new-comment-content');

    const content = contentInput.value;

    if (!content || !content.length) {
        return alert('You cannot post an empty comment!');
    }

    try {
        const response = await axios.post(url, {content});
        if (response.status === 201) {
            const comment = response.data.comment;
            const commentDiv = buildCommentDiv(comment);
            commentContainer.appendChild(commentDiv);
            contentInput.value = '';
            post.dataset.commentCount++;

            commentContainer.style.display = 'block';

            const button = post.querySelector('.btn-comments')
            button.removeEventListener('click', showComments);
            button.textContent = `Hide comment${post.dataset.commentCount == 1 ? '' : 's'}`;
            button.addEventListener('click', hideComments);
            commentDiv.scrollIntoView();
        }

    } catch (error) {
        console.log(error);
    }
}

// helper functions
function formatDateTime(date) {
    const year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

function buildCommentDiv(comment) {
    const commentId = comment._id;
                const author = comment.author.username;
                const authorId = comment.author._id;
                const timestamp = formatDateTime(new Date(comment.createdAt));
                const content = comment.content;

                const commentDiv = document.createElement('div');
                const metadataDiv = document.createElement('div');
                const contentElement = document.createElement('p');
                const authorElement = document.createElement('h4');
                const timestampElement = document.createElement('p');
                const usernameAnchor = document.createElement('a');

                timestampElement.textContent = `${timestamp}`;
                timestampElement.classList.add('comment-timestamp');
                contentElement.textContent = content;
                commentDiv.dataset.author = commentId;
                authorElement.textContent = author;
                usernameAnchor.href = `/profile/${authorId}`;
                usernameAnchor.classList.add('link-profile');
                metadataDiv.classList.add('comment-metadata');

                metadataDiv.appendChild(timestampElement);
                metadataDiv.appendChild(usernameAnchor);
                usernameAnchor.appendChild(authorElement);
                commentDiv.appendChild(metadataDiv);
                commentDiv.appendChild(contentElement);


                commentDiv.classList.add('comment');
                return commentDiv;                
}

console.log('api loaded')