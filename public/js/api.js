const allLikeButtons = document.querySelectorAll('.btn-like');
const allUnlikeButtons = document.querySelectorAll('.btn-unlike');
const allFollowButtons = document.querySelectorAll('.btn-follow');
const allUnfollowButtons = document.querySelectorAll('.btn-unfollow');

const apiBaseUrl = '/api';

for (const likeButton of allLikeButtons) {
    likeButton.addEventListener('click', likePost);
}

for (const unlikeButton of allUnlikeButtons) {
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