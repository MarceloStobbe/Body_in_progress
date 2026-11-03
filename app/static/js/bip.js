let uploadedMediaUrl = null;
let uploadedFileObject = null;
let isVideoMedia = false;
const userPhotoUrl = window.userProfilePhotoUrl || "";
const currentLoggedInUserName = window.currentUserName || "Marcelo Stobbe";

let zoomLevel = 100;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;

let userStories = window.serverStories || [];
let userPosts = window.serverPosts || [];
let currentStoryIndex = 0;

let deleteTargetType = null;
let deleteTargetId = null;

let currentTab = 'home';
let followingState = {};
let likedState = {};
let userActivities = [];
let selectedMusicTrack = "";
let selectedMusicPreviewUrl = "";

document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    renderServerStories();
});

function openStoryModal() {
    document.getElementById('modalHeaderTitle').innerText = 'Create New Story';
    document.getElementById('submitBtnText').innerText = 'Publish Story';
    const previewBox = document.getElementById('previewContainer');
    if (previewBox) previewBox.style.aspectRatio = '1 / 1';
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function openFeedModal() {
    document.getElementById('modalHeaderTitle').innerText = 'Create New Publication';
    document.getElementById('submitBtnText').innerText = 'Publish to BIP';
    const previewBox = document.getElementById('previewContainer');
    if (previewBox) previewBox.style.aspectRatio = '1 / 1';
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function updatePreview() {
    const text = document.getElementById('captionInput').value;
    const previewCap = document.getElementById('previewCaption');
    const previewMusic = document.getElementById('previewMusic');

    if (text.trim() !== "") {
        previewCap.textContent = text;
        const strongEl = document.createElement('strong');
        strongEl.className = 'me-1';
        strongEl.style.color = 'var(--text-main)';
        strongEl.textContent = currentLoggedInUserName;
        previewCap.prepend(strongEl);
    } else {
        previewCap.textContent = '';
    }

    if (selectedMusicTrack !== "") {
        previewMusic.innerHTML = '<i class="bi bi-music-note me-1"></i>' + selectedMusicTrack;
    } else {
        previewMusic.textContent = 'Preview Mode';
    }
}

function searchMusicTracks(query) {
    const resultsContainer = document.getElementById('musicSearchResults');
    if (!query || query.trim().length < 2) {
        resultsContainer.classList.add('d-none');
        resultsContainer.innerHTML = '';
        return;
    }

    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`)
        .then(res => res.json())
        .then(data => {
            resultsContainer.innerHTML = '';
            if (data.results && data.results.length > 0) {
                resultsContainer.classList.remove('d-none');
                data.results.forEach(song => {
                    const trackName = song.trackName;
                    const artistName = song.artistName;
                    const previewUrl = song.previewUrl;
                    const displayString = `${trackName} - ${artistName}`;

                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'list-group-item list-group-item-action text-light border-secondary small';
                    item.style.backgroundColor = '#1a1a1a';
                    item.innerHTML = `<i class="bi bi-music-note me-2" style="color: var(--accent-color);"></i><strong>${trackName}</strong> <span class="text-muted">by ${artistName}</span>`;
                    
                    item.onclick = () => {
                        selectedMusicTrack = displayString;
                        selectedMusicPreviewUrl = previewUrl || "";
                        document.getElementById('musicSearchInput').value = displayString;
                        resultsContainer.classList.add('d-none');
                        updatePreview();
                    };
                    resultsContainer.appendChild(item);
                });
            } else {
                resultsContainer.classList.add('d-none');
            }
        })
        .catch(() => {
            resultsContainer.classList.add('d-none');
        });
}

function previewMedia(event) {
    const file = event.target.files[0];
    const container = document.getElementById('previewContainer');
    const cropControls = document.getElementById('cropControls');
    const muteOption = document.getElementById('muteVideoOption');

    zoomLevel = 100;
    panX = 0;
    panY = 0;
    document.getElementById('zoomRange').value = 100;
    document.getElementById('zoomVal').innerText = "100%";

    if (file) {
        uploadedFileObject = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedMediaUrl = e.target.result;
            cropControls.classList.remove('d-none');
            
            container.innerHTML = '';
            if (file.type.startsWith('video/')) {
                isVideoMedia = true;
                muteOption.classList.remove('d-none');
                const isMuted = document.getElementById('muteVideoSwitch').checked;
                
                const videoEl = document.createElement('video');
                videoEl.id = 'transformableMedia';
                videoEl.src = e.target.result;
                videoEl.className = 'w-100 h-100 object-fit-cover position-absolute';
                videoEl.style.top = '0';
                videoEl.style.left = '0';
                videoEl.style.transform = 'scale(1) translate(0px, 0px)';
                videoEl.controls = true;
                videoEl.autoplay = true;
                videoEl.muted = isMuted;
                container.appendChild(videoEl);
            } else {
                isVideoMedia = false;
                muteOption.classList.add('d-none');
                
                const imgEl = document.createElement('img');
                imgEl.id = 'transformableMedia';
                imgEl.src = e.target.result;
                imgEl.className = 'w-100 h-100 object-fit-cover position-absolute';
                imgEl.style.top = '0';
                imgEl.style.left = '0';
                imgEl.style.transform = 'scale(1) translate(0px, 0px)';
                imgEl.draggable = false;
                container.appendChild(imgEl);
            }
            initDragEvents(container);
        }
        reader.readAsDataURL(file);
    } else {
        uploadedMediaUrl = null;
        uploadedFileObject = null;
        isVideoMedia = false;
        cropControls.classList.add('d-none');
        muteOption.classList.add('d-none');
        container.textContent = 'No photo or video selected';
    }
}

function applyMediaTransform() {
    zoomLevel = document.getElementById('zoomRange').value;
    document.getElementById('zoomVal').innerText = zoomLevel + "%";
    const media = document.getElementById('transformableMedia');
    if (media) {
        media.style.transform = `scale(${zoomLevel / 100}) translate(${panX}px, ${panY}px)`;
    }
}

function initDragEvents(container) {
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.style.cursor = 'grabbing';
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyMediaTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });
}

function toggleVideoMute() {
    const videoTag = document.getElementById('transformableMedia');
    const isMuted = document.getElementById('muteVideoSwitch').checked;
    if (videoTag && isVideoMedia) {
        videoTag.muted = isMuted;
    }
}

function toggleFeedAudio(btn) {
    const icon = btn.querySelector('i');
    const container = btn.closest('.position-relative');
    const audioPlayer = container.querySelector('audio');
    
    if (audioPlayer) {
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                icon.className = 'bi bi-volume-up-fill text-light';
            }).catch(err => console.log("Audio play blocked:", err));
        } else {
            audioPlayer.pause();
            icon.className = 'bi bi-volume-mute-fill text-light';
        }
    }
}

function formatSimpleDate(dateString) {
    if (!dateString) return 'Just now';
    const postDate = new Date(dateString.replace(' ', 'T'));
    const today = new Date();
    
    const isToday = postDate.getDate() === today.getDate() &&
                    postDate.getMonth() === today.getMonth() &&
                    postDate.getFullYear() === today.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = postDate.getDate() === yesterday.getDate() &&
                        postDate.getMonth() === yesterday.getMonth() &&
                        postDate.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Posted today';
    if (isYesterday) return 'Posted yesterday';

    const day = String(postDate.getDate()).padStart(2, '0');
    const month = String(postDate.getMonth() + 1).padStart(2, '0');
    const year = postDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function switchTab(tabName) {
    currentTab = tabName;
    renderContent();
}

function toggleFollowUser(authorName, btn) {
    const isFollowing = followingState[authorName] || false;
    followingState[authorName] = !isFollowing;

    if (!isFollowing) {
        userActivities.unshift({ id: Date.now(), type: 'follow', target: authorName, text: `Started following ${authorName}`, time: 'Just now' });
    } else {
        userActivities.unshift({ id: Date.now(), type: 'follow', target: authorName, text: `Unfollowed ${authorName}`, time: 'Just now' });
    }

    renderContent();
}

function toggleLikePost(postId, authorName, btn) {
    const isLiked = likedState[postId] || false;
    likedState[postId] = !isLiked;

    if (!isLiked) {
        userActivities.unshift({ id: Date.now(), type: 'post_ref', targetId: postId, text: `Liked a publication by ${authorName}`, time: 'Just now' });
    } else {
        userActivities.unshift({ id: Date.now(), type: 'post_ref', targetId: postId, text: `Unliked a publication by ${authorName}`, time: 'Just now' });
    }

    renderContent();
}

function addComment(postId, authorName, inputEl) {
    const commentText = inputEl.value.trim();
    if (!commentText) return;

    if (!window.postComments) window.postComments = {};
    if (!window.postComments[postId]) window.postComments[postId] = [];
    window.postComments[postId].push({ author: currentLoggedInUserName, text: commentText, time: 'Just now' });

    userActivities.unshift({ id: Date.now(), type: 'post_ref', targetId: postId, text: `Commented "${commentText}" on ${authorName}'s post`, time: 'Just now' });
    inputEl.value = '';
    renderContent();
}

function navigateToActivity(activity) {
    if (activity.type === 'follow') {
        switchTab('following');
    } else if (activity.type === 'post_ref' && activity.targetId) {
        switchTab('home');
        setTimeout(() => {
            const card = document.getElementById(`postCard${activity.targetId}`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.border = '2px solid var(--accent-color)';
                setTimeout(() => card.style.border = '', 2000);
            }
        }, 100);
    }
}

function removeActivityItem(activityId) {
    userActivities = userActivities.filter(act => act.id !== activityId);
    renderContent();
}

function deletePost(postId) {
    deleteTargetType = 'post';
    deleteTargetId = postId;
    document.getElementById('confirmDeleteTitle').innerText = 'Delete Publication';
    document.getElementById('confirmDeleteText').innerText = 'Are you sure you want to delete this publication? This action cannot be undone.';
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmModal.show();
}

function openStoryViewerModal(index = 0) {
    if (userStories.length === 0) return;
    currentStoryIndex = index;
    renderCurrentStory();
    const modal = new bootstrap.Modal(document.getElementById('storyViewerModal'));
    modal.show();
}

function renderCurrentStory() {
    const mediaContainer = document.getElementById('storyMediaContent');
    const footerContainer = document.getElementById('storyFooterContent');
    const captionEl = document.getElementById('storyCaptionText');
    const musicEl = document.getElementById('storyMusicText');
    const usernameEl = document.getElementById('viewerUsernameText');

    const story = userStories[currentStoryIndex];
    if (story) {
        if (usernameEl) {
            usernameEl.innerText = story.author_name || currentLoggedInUserName;
        }

        mediaContainer.innerHTML = '';
        
        mediaContainer.style.aspectRatio = '1 / 1';
        mediaContainer.style.width = '100%';
        mediaContainer.style.maxHeight = '380px';

        if (story.is_video || story.isVideo) {
            const vid = document.createElement('video');
            vid.src = story.media_url || story.mediaUrl;
            vid.className = 'w-100 h-100 object-fit-cover position-absolute';
            vid.style.top = '0';
            vid.style.left = '0';
            vid.controls = true;
            vid.autoplay = true;
            vid.muted = story.is_muted || story.isMuted || false;
            mediaContainer.appendChild(vid);
        } else {
            const img = document.createElement('img');
            img.src = story.media_url || story.mediaUrl;
            img.className = 'w-100 h-100 object-fit-cover position-absolute';
            img.style.top = '0';
            img.style.left = '0';
            mediaContainer.appendChild(img);
        }

        if (story.music_preview_url) {
            const audioEl = document.createElement('audio');
            audioEl.src = story.music_preview_url;
            audioEl.loop = true;
            mediaContainer.appendChild(audioEl);

            const soundBtn = document.createElement('button');
            soundBtn.className = 'btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center opacity-75 shadow-sm';
            soundBtn.style.cssText = 'width: 34px; height: 34px; background-color: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); z-index: 10;';
            soundBtn.onclick = () => toggleFeedAudio(soundBtn);
            soundBtn.innerHTML = '<i class="bi bi-volume-mute-fill text-light" style="font-size: 1rem;"></i>';
            mediaContainer.appendChild(soundBtn);
        }

        const cap = story.caption || '';
        const mus = story.music || '';

        if (cap.trim() !== "" || mus !== "") {
            footerContainer.style.display = 'block';
            captionEl.innerText = cap;
            musicEl.innerHTML = mus ? '<i class="bi bi-music-note-beamed me-1"></i>' + mus : '';
        } else {
            footerContainer.style.display = 'none';
        }
    }
}

function prevStory() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        renderCurrentStory();
    }
}

function nextStory() {
    if (currentStoryIndex < userStories.length - 1) {
        currentStoryIndex++;
        renderCurrentStory();
    } else {
        const viewerModalEl = document.getElementById('storyViewerModal');
        const viewerModalInstance = bootstrap.Modal.getInstance(viewerModalEl);
        if (viewerModalInstance) {
            viewerModalInstance.hide();
        }
    }
}

function confirmDeleteStory() {
    deleteTargetType = 'story';
    document.getElementById('confirmDeleteTitle').innerText = 'Delete Story';
    document.getElementById('confirmDeleteText').innerText = 'Are you sure you want to delete this story? This action cannot be undone.';
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmModal.show();
}

function executeDelete() {
    const confirmModalEl = document.getElementById('confirmDeleteModal');
    const confirmModalInstance = bootstrap.Modal.getInstance(confirmModalEl);
    if (confirmModalInstance) {
        confirmModalInstance.hide();
    }

    if (deleteTargetType === 'story') {
        const story = userStories[currentStoryIndex];
        if (story && story.id) {
            fetch(`/api/bip/stories/${story.id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(() => {
                    userStories.splice(currentStoryIndex, 1);
                    userActivities.unshift({ id: Date.now(), type: 'general', text: `Deleted a story`, time: 'Just now' });
                    renderServerStories();
                    const viewerModalEl = document.getElementById('storyViewerModal');
                    const viewerModalInstance = bootstrap.Modal.getInstance(viewerModalEl);
                    if (viewerModalInstance) viewerModalInstance.hide();
                });
        }
    } else if (deleteTargetType === 'post') {
        const numericId = deleteTargetId.replace('postCard', '');
        fetch(`/api/bip/posts/${numericId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                userPosts = userPosts.filter(p => p.id != numericId);
                userActivities.unshift({ id: Date.now(), type: 'general', text: `Deleted a publication`, time: 'Just now' });
                renderContent();
            });
    }
    deleteTargetType = null;
    deleteTargetId = null;
}

function renderServerStories() {
    const storiesBar = document.getElementById('stories-bar');
    const existingStoryItem = document.getElementById('userActiveStoryItem');
    if (existingStoryItem) existingStoryItem.remove();

    if (userStories.length > 0) {
        const latestStory = userStories[0];
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'text-center flex-shrink-0';
        itemDiv.id = 'userActiveStoryItem';
        itemDiv.style.cursor = 'pointer';
        itemDiv.onclick = () => openStoryViewerModal(0);

        const outerCircle = document.createElement('div');
        outerCircle.className = 'position-relative rounded-circle p-1 d-flex align-items-center justify-content-center mx-auto mb-1';
        outerCircle.style.width = '64px';
        outerCircle.style.height = '64px';
        outerCircle.style.border = '2px solid var(--accent-color)';
        outerCircle.style.background = 'linear-gradient(45deg, var(--accent-color), #00ff66)';

        const innerCircle = document.createElement('div');
        innerCircle.className = 'rounded-circle p-0.5 w-100 h-100 overflow-hidden bg-dark d-flex align-items-center justify-content-center';

        if (latestStory.media_url || latestStory.mediaUrl) {
            const img = document.createElement('img');
            img.src = latestStory.media_url || latestStory.mediaUrl;
            img.className = 'rounded-circle w-100 h-100 object-fit-cover';
            innerCircle.appendChild(img);
        } else {
            const span = document.createElement('span');
            span.className = 'fw-bold';
            span.style.fontSize = '0.85rem';
            span.style.color = 'var(--text-main)';
            span.textContent = currentLoggedInUserName[0];
            innerCircle.appendChild(span);
        }

        outerCircle.appendChild(innerCircle);

        const small = document.createElement('small');
        small.className = 'text-truncate d-block';
        small.style.fontSize = '0.75rem';
        small.style.maxWidth = '64px';
        small.style.color = 'var(--text-main)';
        small.textContent = currentLoggedInUserName;

        itemDiv.appendChild(outerCircle);
        itemDiv.appendChild(small);
        storiesBar.appendChild(itemDiv);
    }
}

function renderContent() {
    const feedContainer = document.getElementById('feed-container');

    if (currentTab === 'activity') {
        feedContainer.innerHTML = '';
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card rounded-4 shadow-sm p-4 border-secondary mb-4';
        cardDiv.style.backgroundColor = 'var(--bg-card)';
        cardDiv.style.color = 'var(--text-main)';

        const h5 = document.createElement('h5');
        h5.className = 'fw-bold mb-3';
        h5.style.color = 'var(--accent-color)';
        h5.textContent = 'My Activity & Interactions';
        cardDiv.appendChild(h5);

        if (userActivities.length === 0) {
            const p = document.createElement('p');
            p.className = 'small mb-0';
            p.style.cssText = 'color: var(--text-main); opacity: 0.85;';
            p.textContent = 'No recent activities or interactions found.';
            cardDiv.appendChild(p);
        } else {
            const ul = document.createElement('ul');
            ul.className = 'list-unstyled mb-0 d-flex flex-column gap-3';
            
            userActivities.forEach(act => {
                const li = document.createElement('li');
                li.className = 'd-flex align-items-center justify-content-between pb-2 border-bottom border-secondary';

                const leftDiv = document.createElement('div');
                leftDiv.className = 'd-flex align-items-start gap-3';

                const icon = document.createElement('i');
                icon.className = 'bi bi-clock-history fs-5 mt-1';
                icon.style.color = 'var(--accent-color)';
                leftDiv.appendChild(icon);

                const textDiv = document.createElement('div');
                const pText = document.createElement('p');
                pText.className = 'mb-1 small fw-semibold';
                pText.style.color = 'var(--text-main)';
                pText.textContent = act.text;
                
                const smallTime = document.createElement('small');
                smallTime.style.cssText = 'font-size: 0.7rem; color: var(--text-main); opacity: 0.7;';
                smallTime.textContent = act.time;

                textDiv.appendChild(pText);
                textDiv.appendChild(smallTime);
                leftDiv.appendChild(textDiv);
                li.appendChild(leftDiv);

                const rightDiv = document.createElement('div');
                rightDiv.className = 'd-flex align-items-center gap-2';

                if (act.type === 'follow' || act.type === 'post_ref') {
                    const goBtn = document.createElement('button');
                    goBtn.className = 'btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm';
                    goBtn.style.cssText = 'width: 28px; height: 28px; border-color: rgba(255, 255, 255, 0.3); color: var(--accent-color);';
                    goBtn.title = 'Go to Activity';
                    goBtn.onclick = () => navigateToActivity(act);
                    goBtn.innerHTML = '<i class="bi bi-box-arrow-up-right fs-6"></i>';
                    rightDiv.appendChild(goBtn);
                }

                const delBtn = document.createElement('button');
                delBtn.className = 'btn btn-sm btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm';
                delBtn.style.cssText = 'width: 28px; height: 28px; border-color: rgba(220, 53, 69, 0.4);';
                delBtn.title = 'Delete Activity Item';
                delBtn.onclick = () => removeActivityItem(act.id);
                delBtn.innerHTML = '<i class="bi bi-trash fs-6"></i>';
                rightDiv.appendChild(delBtn);

                li.appendChild(rightDiv);
                ul.appendChild(li);
            });
            cardDiv.appendChild(ul);
        }
        feedContainer.appendChild(cardDiv);
        return;
    }

    let postsToRender = userPosts;
    if (currentTab === 'following') {
        postsToRender = userPosts.filter(p => followingState[p.author_name] === true);
    }

    if (!postsToRender || postsToRender.length === 0) {
        feedContainer.innerHTML = `
            <div id="noPostsYetMessage" class="text-center py-5 text-muted">
                <i class="bi bi-camera fs-1 d-block mb-2" style="color: var(--accent-color); opacity: 0.5;"></i>
                <p class="small" style="color: var(--text-muted);">No posts found in this view.</p>
            </div>
        `;
        return;
    }

    feedContainer.innerHTML = '';
    postsToRender.forEach(post => {
        const currentId = post.id;
        const authorName = post.author_name && post.author_name !== 'User' ? post.author_name : currentLoggedInUserName;
        const formattedDate = formatSimpleDate(post.created_at);
        const isSelfPost = authorName === currentLoggedInUserName;
        const isFollowing = followingState[authorName] || false;
        const isLiked = likedState[currentId] || false;
        const heartIconClass = isLiked ? 'bi-heart-fill text-danger' : 'bi-heart';

        const card = document.createElement('div');
        card.className = 'card rounded-4 shadow-sm mb-4 border-secondary';
        card.id = `postCard${currentId}`;
        card.style.cssText = 'background-color: var(--bg-card); color: var(--text-main);';

        const header = document.createElement('div');
        header.className = 'card-header bg-transparent border-0 d-flex align-items-center justify-content-between p-3';

        const headerLeft = document.createElement('div');
        headerLeft.className = 'd-flex align-items-center gap-3';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'rounded-circle overflow-hidden d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0';
        avatarDiv.style.cssText = 'width: 42px; height: 42px; border: 1.5px solid var(--accent-color); color: var(--text-main);';
        if (userPhotoUrl) {
            const img = document.createElement('img');
            img.src = userPhotoUrl;
            img.alt = 'Profile';
            img.className = 'w-100 h-100 object-fit-cover';
            avatarDiv.appendChild(img);
        } else {
            const span = document.createElement('span');
            span.style.color = 'var(--accent-color)';
            span.textContent = authorName[0];
            avatarDiv.appendChild(span);
        }
        headerLeft.appendChild(avatarDiv);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'd-flex flex-column justify-content-center';

        const nameRow = document.createElement('div');
        nameRow.className = 'd-flex align-items-center gap-2';

        const h6 = document.createElement('h6');
        h6.className = 'fw-bold mb-0 lh-1';
        h6.style.cssText = 'font-size: 0.95rem; color: var(--text-main);';
        h6.textContent = authorName;
        nameRow.appendChild(h6);

        if (!isSelfPost) {
            const followBtn = document.createElement('button');
            followBtn.className = 'btn btn-sm rounded-pill py-0 px-2 follow-btn';
            followBtn.style.fontSize = '0.7rem';
            if (isFollowing) {
                followBtn.style.cssText += 'background-color: var(--accent-color); color: #111; border-color: var(--accent-color);';
                followBtn.textContent = 'Following';
            } else {
                followBtn.style.cssText += 'background-color: transparent; color: var(--accent-color); border-color: var(--accent-color);';
                followBtn.textContent = 'Follow';
            }
            followBtn.onclick = () => toggleFollowUser(authorName, followBtn);
            nameRow.appendChild(followBtn);
        }
        infoDiv.appendChild(nameRow);

        const metaRow = document.createElement('div');
        metaRow.className = 'd-flex align-items-center gap-1 mt-1';
        metaRow.style.cssText = 'font-size: 0.72rem; line-height: 1; color: var(--text-muted);';
        
        const dateSpan = document.createElement('span');
        dateSpan.textContent = formattedDate;
        metaRow.appendChild(dateSpan);

        if (post.music) {
            const dotSpan = document.createElement('span');
            dotSpan.className = 'mx-1';
            dotSpan.textContent = '•';
            metaRow.appendChild(dotSpan);

            const musicSpan = document.createElement('span');
            musicSpan.style.color = 'var(--accent-color)';
            musicSpan.innerHTML = '<i class="bi bi-music-note me-1"></i>' + post.music;
            metaRow.appendChild(musicSpan);
        }
        infoDiv.appendChild(metaRow);
        headerLeft.appendChild(infoDiv);
        header.appendChild(headerLeft);

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        dropdown.innerHTML = `
            <button class="btn btn-sm btn-link p-1 border-0 dropdown-toggle-no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Post Options" style="color: var(--text-main);">
                <i class="bi bi-three-dots-vertical fs-5" style="color: var(--accent-color) !important;"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end border-secondary shadow">
                <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" href="#" data-bs-toggle="collapse" data-bs-target="#editPost${currentId}">
                        <i class="bi bi-pencil-square" style="color: var(--accent-color);"></i> Edit Caption
                    </a>
                </li>
                <li><hr class="dropdown-divider border-secondary"></li>
                <li>
                    <a class="dropdown-item d-flex align-items-center gap-2 text-danger" href="#" onclick="deletePost('postCard${currentId}')">
                        <i class="bi bi-trash3-fill"></i> Delete Post
                    </a>
                </li>
            </ul>
        `;
        header.appendChild(dropdown);
        card.appendChild(header);

        if (post.media_url) {
            const mediaBox = document.createElement('div');
            mediaBox.className = 'position-relative bg-black overflow-hidden w-100';
            mediaBox.style.aspectRatio = '1 / 1';

            if (post.is_video) {
                const vid = document.createElement('video');
                vid.src = post.media_url;
                vid.className = 'w-100 h-100 object-fit-cover position-absolute';
                vid.style.cssText = 'top:0; left:0;';
                vid.controls = true;
                vid.muted = post.is_muted;
                mediaBox.appendChild(vid);
            } else {
                const img = document.createElement('img');
                img.src = post.media_url;
                img.className = 'w-100 h-100 object-fit-cover position-absolute';
                img.style.cssText = 'top:0; left:0;';
                mediaBox.appendChild(img);
            }

            if (post.music_preview_url) {
                const audioEl = document.createElement('audio');
                audioEl.src = post.music_preview_url;
                audioEl.loop = true;
                mediaBox.appendChild(audioEl);

                const soundBtn = document.createElement('button');
                soundBtn.className = 'btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center opacity-75 shadow-sm';
                soundBtn.style.cssText = 'width: 34px; height: 34px; background-color: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); z-index: 10;';
                soundBtn.onclick = () => toggleFeedAudio(soundBtn);
                soundBtn.innerHTML = '<i class="bi bi-volume-mute-fill text-light" style="font-size: 1rem;"></i>';
                mediaBox.appendChild(soundBtn);
            }

            card.appendChild(mediaBox);
        }

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body py-3';

        const actionsRow = document.createElement('div');
        actionsRow.className = 'd-flex align-items-center gap-3 mb-2';
        actionsRow.innerHTML = `
            <button class="btn btn-sm p-0 d-flex align-items-center gap-1 fs-5" style="color: inherit;" onclick="toggleLikePost(${currentId}, '${authorName}', this)">
                <i class="bi ${heartIconClass}"></i>
            </button>
            <button class="btn btn-sm p-0 d-flex align-items-center gap-1 fs-5" style="color: var(--accent-color) !important;" data-bs-toggle="collapse" data-bs-target="#commentsPost${currentId}">
                <i class="bi bi-chat"></i>
            </button>
            <button class="btn btn-sm p-0 ms-auto fs-5" style="color: var(--text-main);">
                <i class="bi bi-bookmark"></i>
            </button>
        `;
        cardBody.appendChild(actionsRow);

        const likesCount = document.createElement('div');
        likesCount.className = 'fw-bold mb-1';
        likesCount.style.cssText = 'font-size: 0.85rem; color: var(--accent-color);';
        likesCount.textContent = '0 likes';
        cardBody.appendChild(likesCount);

        const captionP = document.createElement('p');
        captionP.className = 'card-text mb-2';
        captionP.id = `captionText${currentId}`;
        captionP.style.fontSize = '0.95rem';
        if (post.caption) {
            captionP.innerHTML = `<strong class="me-1" style="color: var(--text-main);">${authorName}</strong><span id="captionContent${currentId}">${post.caption}</span>`;
        } else {
            captionP.style.display = 'none';
        }
        cardBody.appendChild(captionP);

        const editCollapse = document.createElement('div');
        editCollapse.className = 'collapse pt-2 mt-2 border-top border-secondary';
        editCollapse.id = `editPost${currentId}`;
        editCollapse.innerHTML = `
            <label class="form-label small mb-1" style="color: var(--text-muted);">Edit Caption</label>
            <div class="input-group input-group-sm">
                <input type="text" class="form-control text-light border-secondary" id="editInput${currentId}" value="${post.caption || ''}" style="background-color: rgba(0,0,0,0.4) !important; font-size: 0.85rem; color: var(--text-main) !important;">
                <button class="btn btn-outline-secondary" type="button" onclick="const val = document.getElementById('editInput${currentId}').value; const el = document.getElementById('captionText${currentId}'); el.style.display='block'; el.innerHTML = '<strong class=\\'me-1\\' style=\\'color: var(--text-main);\\'>${authorName}</strong>' + val; bootstrap.Collapse.getInstance(document.getElementById('editPost${currentId}')).hide();" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);">Save</button>
            </div>
        `;
        cardBody.appendChild(editCollapse);

        let commentsListHtml = '';
        const postCommentsArr = (window.postComments && window.postComments[currentId]) ? window.postComments[currentId] : [];
        postCommentsArr.forEach(c => {
            commentsListHtml += `
                <div class="d-flex justify-content-between align-items-start mb-1 small">
                    <div><strong style="color: var(--accent-color);" class="me-1">${c.author}</strong><span style="color: var(--text-main);">${c.text}</span></div>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">${c.time}</span>
                </div>
            `;
        });

        const commentsCollapse = document.createElement('div');
        commentsCollapse.className = 'collapse pt-2 mt-2 border-top border-secondary';
        commentsCollapse.id = `commentsPost${currentId}`;
        commentsCollapse.innerHTML = `
            <div class="mb-2 comments-container" style="max-height: 150px; overflow-y: auto;">
                ${commentsListHtml || '<small class="text-muted">No comments yet. Be the first to comment!</small>'}
            </div>
            <div class="input-group input-group-sm">
                <input type="text" class="form-control text-light border-secondary" id="commentInput${currentId}" placeholder="Add a comment..." style="background-color: rgba(0,0,0,0.4) !important; font-size: 0.85rem; color: var(--text-main) !important;">
                <button class="btn btn-outline-secondary" type="button" onclick="addComment(${currentId}, '${authorName}', document.getElementById('commentInput${currentId}'))" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);"><i class="bi bi-send"></i></button>
            </div>
        `;
        cardBody.appendChild(commentsCollapse);

        card.appendChild(cardBody);
        feedContainer.appendChild(card);
    });
}

function handlePostSubmit(e) {
    e.preventDefault();
    const isStoryMode = document.getElementById('modalHeaderTitle').innerText.includes('Story');

    if (!uploadedFileObject) {
        const valModal = new bootstrap.Modal(document.getElementById('validationAlertModal'));
        valModal.show();
        return;
    }

    const caption = document.getElementById('captionInput').value;
    const music = selectedMusicTrack;
    const musicPreviewUrl = selectedMusicPreviewUrl;
    const isMuted = document.getElementById('muteVideoSwitch').checked;

    if (isVideoMedia) {
        const formData = new FormData();
        formData.append('media_file', uploadedFileObject);
        formData.append('caption', caption);
        formData.append('music', music);
        formData.append('music_preview_url', musicPreviewUrl);
        formData.append('is_muted', isMuted);
        sendPostData(formData, isStoryMode);
    } else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = uploadedMediaUrl;
        img.onload = () => {
            canvas.width = 1080;
            canvas.height = 1080;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const scale = zoomLevel / 100;
            const previewWidth = document.getElementById('previewContainer').clientWidth || 360;

            const baseSize = Math.max(canvas.width, canvas.height) * scale;
            const offsetX = (canvas.width - baseSize) / 2 + (panX * (canvas.width / previewWidth));
            const offsetY = (canvas.height - baseSize) / 2 + (panY * (canvas.height / previewWidth));

            ctx.drawImage(img, offsetX, offsetY, baseSize, baseSize);

            canvas.toBlob((blob) => {
                const croppedFile = new File([blob], uploadedFileObject.name, { type: 'image/jpeg' });
                const formData = new FormData();
                formData.append('media_file', croppedFile);
                formData.append('caption', caption);
                formData.append('music', music);
                formData.append('music_preview_url', musicPreviewUrl);
                formData.append('is_muted', isMuted);
                sendPostData(formData, isStoryMode);
            }, 'image/jpeg', 0.92);
        };
    }
}

function sendPostData(formData, isStoryMode) {
    const endpoint = isStoryMode ? '/api/bip/stories' : '/api/bip/posts';

    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            if (isStoryMode) {
                userStories.unshift(data.story);
                userActivities.unshift({ id: Date.now(), type: 'general', text: `Created a new story`, time: 'Just now' });
                renderServerStories();
            } else {
                userPosts.unshift(data.post);
                userActivities.unshift({ id: Date.now(), type: 'general', text: `Created a new publication`, time: 'Just now' });
                renderContent();
            }
            document.getElementById('postForm').reset();
            document.getElementById('musicSearchInput').value = '';
            selectedMusicTrack = "";
            selectedMusicPreviewUrl = "";
            document.getElementById('previewContainer').textContent = 'No photo or video selected';
            document.getElementById('previewCaption').textContent = '';
            document.getElementById('previewMusic').textContent = 'Preview Mode';
            document.getElementById('cropControls').classList.add('d-none');
            document.getElementById('muteVideoOption').classList.add('d-none');
            uploadedMediaUrl = null;
            uploadedFileObject = null;
            isVideoMedia = false;
            
            const modalEl = document.getElementById('createPostModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    });
}