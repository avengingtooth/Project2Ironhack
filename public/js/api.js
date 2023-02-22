const allLikeButtons = document.querySelectorAll('.btn-like');
const allUnlikeButtons = document.querySelectorAll('.btn-unlike');
const allFollowButtons = document.querySelectorAll('.btn-follow');
const allUnfollowButtons = document.querySelectorAll('.btn-unfollow');

const allcommentButtons = document.querySelectorAll('.btn-comments');
const allPosts = document.querySelectorAll('.post');

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
    const postId = event.target.closest('.post').dataset.id;
    const button = event.target;
    const url = `${apiBaseUrl}/like/${postId}`;
    try {
        console.log('trying to like')
        const response = await axios.post(url);
        if (response.status === 201) {
            console.log('like successful')
            // TODO handle updating the page (changing from like button to unlike button)
            button.removeEventListener('click', likePost);
            button.addEventListener('click', unlikePost);
            button.textContent = 'Unlike';

        } else {
            console.log('Error while liking Post:', response.data.errorMessage)
        }
    } catch (error) {
        console.log('critical error while liking post', error)
    }
}

async function unlikePost(event) {
    const postId = event.target.closest('.post').dataset.id;
    const button = event.target;
    const url = `${apiBaseUrl}/like/${postId}`;
    try {
        const response = await axios.delete(url);
        if (response.status === 201) {
            console.log('unlike successful')
            // TODO handle updating the page (changing from unlike button to like button)
            button.removeEventListener('click', unlikePost);
            button.addEventListener('click', likePost);
            button.textContent = 'Like';
        } else {
            console.log('Error while unliking Post:', response.data.errorMessage)
        }
    } catch (error) {
        console.log('critical error while unliking post', error)
    }
}

async function followUser(event) {
    const authorId = event.target.closest('.post').dataset.author;
    const url = `${apiBaseUrl}/follow/${authorId}`;
    try {
        const response = await axios.post(url);
        if (response.status === 201) {
            console.log('follow successful')
            // TODO handle updating the page (changing from follow button to unfollow button)
            const allPostsByThisAuthor = document.querySelectorAll(`[data-author="${authorId}"]`);
            for (const post of allPostsByThisAuthor) {
                const buttons = post.querySelectorAll('.follow-unfollow');
                for (const button of buttons) {
                    button.removeEventListener('click', followUser);
                    button.addEventListener('click', unfollowUser);
                    button.textContent = 'Unfollow';
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
    const authorId = event.target.closest('.post').dataset.author;
    const url = `${apiBaseUrl}/follow/${authorId}`;
    const button = event.target;

    try {
        const response = await axios.delete(url);
        if (response.status === 201) {
            console.log('unfollow successful')
            // TODO handle updating the page (changing from like button to unlike button)
            const allPostsByThisAuthor = document.querySelectorAll(`[data-author="${authorId}"]`);
            for (const post of allPostsByThisAuthor) {
                const buttons = post.querySelectorAll('.follow-unfollow');
                for (const button of buttons) {
                    button.removeEventListener('click', unfollowUser);
                    button.addEventListener('click', followUser);
                    button.textContent = 'Follow';
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
    const post = event.target.closest('.post');
    const commentContainer = post.querySelector('.comments-feed-container');
    const button = event.target;

    commentContainer.style.display = 'block';

    button.removeEventListener('click', showComments);
    button.textContent = `Hide comment${post.dataset.commentCount == 1 ? '' : 's'}`;
    button.addEventListener('click', hideComments);
}

function hideComments(event) {
    const post = event.target.closest('.post');
    const commentContainer = post.querySelector('.comments-feed-container');
    const button = event.target;

    commentContainer.style.display = 'none';

    button.removeEventListener('click', hideComments);
    button.textContent = `Show ${post.dataset.commentCount} comment${post.dataset.commentCount == 1 ? '' : 's'}`;
    button.addEventListener('click', showComments);
}

async function postComment(event) {
    event.preventDefault();

    const post = event.target.closest('.post');
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
            button.removeEventListener('click', hideComments);
            button.textContent = `Show ${post.dataset.commentCount} comment${post.dataset.commentCount == 1 ? '' : 's'}`;
            button.addEventListener('click', showComments);
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
                const timestamp = formatDateTime(new Date(comment.createdAt));
                const content = comment.content;

                const commentDiv = document.createElement('div');
                const metadataDiv = document.createElement('div');
                const contentElement = document.createElement('p');
                const authorElement = document.createElement('h4');
                const timestampElement = document.createElement('p');

                timestampElement.textContent = `Posted on ${timestamp}`;
                contentElement.textContent = content;
                commentDiv.dataset.author = commentId;
                authorElement.textContent = author;

                metadataDiv.appendChild(authorElement);
                metadataDiv.appendChild(timestampElement);
                commentDiv.appendChild(metadataDiv);
                commentDiv.appendChild(contentElement);

                return commentDiv;                
}