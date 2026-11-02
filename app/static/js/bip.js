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

let audioCtx = null;
let synthOsc = null;

let userStories = window.serverStories || [];
let userPosts = window.serverPosts || [];
let currentStoryIndex = 0;

let deleteTargetType = null;
let deleteTargetId = null;

let currentTab = 'home';
let followingState = {};
let likedState = {};
let userActivities = [];

document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    renderServerStories();
});

function openStoryModal() {
    document.getElementById('modalHeaderTitle').innerText = 'Create New Story';
    document.getElementById('submitBtnText').innerText = 'Publish Story';
    document.getElementById('previewContainer').style.height = '380px';
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function openFeedModal() {
    document.getElementById('modalHeaderTitle').innerText = 'Create New Publication';
    document.getElementById('submitBtnText').innerText = 'Publish to BIP';
    document.getElementById('previewContainer').style.height = '280px';
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function updatePreview() {
    const text = document.getElementById('captionInput').value;
    const music = document.getElementById('musicSelect').value;
    const previewCap = document.getElementById('previewCaption');
    const previewMusic = document.getElementById('previewMusic');

    if (text.trim() !== "") {
        previewCap.innerHTML = `<strong class="me-1" style="color: var(--text-main);">${currentLoggedInUserName}</strong>${text}`;
    } else {
        previewCap.innerHTML = ``;
    }

    if (music !== "") {
        previewMusic.innerHTML = `<i class="bi bi-music-note me-1"></i>${music}`;
    } else {
        previewMusic.innerHTML = `Preview Mode`;
    }
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
            
            if (file.type.startsWith('video/')) {
                isVideoMedia = true;
                muteOption.classList.remove('d-none');
                const isMuted = document.getElementById('muteVideoSwitch').checked;
                container.innerHTML = `<video id="transformableMedia" src="${e.target.result}" class="w-100 h-100 object-fit-cover position-absolute" style="top:0; left:0; transform: scale(1) translate(0px, 0px);" controls autoplay ${isMuted ? 'muted' : ''}></video>`;
            } else {
                isVideoMedia = false;
                muteOption.classList.add('d-none');
                container.innerHTML = `<img id="transformableMedia" src="${e.target.result}" class="w-100 h-100 object-fit-cover position-absolute" style="top:0; left:0; transform: scale(1) translate(0px, 0px);" draggable="false">`;
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
        container.innerHTML = `No photo or video selected`;
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
    const video = container.querySelector('video');
    
    if (video) {
        video.muted = !video.muted;
        if (video.muted) {
            icon.className = 'bi bi-volume-mute-fill text-light';
        } else {
            icon.className = 'bi bi-volume-up-fill text-light';
            video.play();
        }
    } else {
        if (icon.classList.contains('bi-volume-mute-fill')) {
            icon.className = 'bi bi-volume-up-fill text-light';
            playSynthTone();
        } else {
            icon.className = 'bi bi-volume-mute-fill text-light';
            stopSynthTone();
        }
    }
}

function playSynthTone() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!synthOsc) {
        synthOsc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        synthOsc.type = 'sine';
        synthOsc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        synthOsc.connect(gain);
        gain.connect(audioCtx.destination);
        synthOsc.start();
    }
}

function stopSynthTone() {
    if (synthOsc) {
        synthOsc.stop();
        synthOsc = null;
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

        if (story.is_video || story.isVideo) {
            mediaContainer.innerHTML = `<video src="${story.media_url || story.mediaUrl}" class="w-100 h-100 object-fit-cover" controls autoplay ${(story.is_muted || story.isMuted) ? 'muted' : ''}></video>`;
        } else {
            mediaContainer.innerHTML = `<img src="${story.media_url || story.mediaUrl}" class="w-100 h-100 object-fit-cover">`;
        }

        const cap = story.caption || '';
        const mus = story.music || '';

        if (cap.trim() !== "" || mus !== "") {
            footerContainer.style.display = 'block';
            captionEl.innerText = cap;
            musicEl.innerHTML = mus ? `<i class="bi bi-music-note-beamed me-1"></i>${mus}` : '';
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
        const mediaThumbnail = (latestStory.media_url || latestStory.mediaUrl) ? `<img src="${latestStory.media_url || latestStory.mediaUrl}" class="rounded-circle w-100 h-100 object-fit-cover">` : `<span class="fw-bold" style="font-size: 0.85rem; color: var(--text-main);">${currentLoggedInUserName[0]}</span>`;
        
        const newStoryHtml = `
            <div class="text-center flex-shrink-0" id="userActiveStoryItem" style="cursor: pointer;" onclick="openStoryViewerModal(0)">
                <div class="position-relative rounded-circle p-1 d-flex align-items-center justify-content-center mx-auto mb-1" style="width: 64px; height: 64px; border: 2px solid var(--accent-color); background: linear-gradient(45deg, var(--accent-color), #00ff66);">
                    <div class="rounded-circle p-0.5 w-100 h-100 overflow-hidden bg-dark d-flex align-items-center justify-content-center">
                        ${mediaThumbnail}
                    </div>
                </div>
                <small class="text-truncate d-block" style="font-size: 0.75rem; max-width: 64px; color: var(--text-main);">${currentLoggedInUserName}</small>
            </div>
        `;
        storiesBar.insertAdjacentHTML('beforeend', newStoryHtml);
    }
}

function renderContent() {
    const feedContainer = document.getElementById('feed-container');

    if (currentTab === 'activity') {
        let activityHtml = `
            <div class="card rounded-4 shadow-sm p-4 border-secondary mb-4" style="background-color: var(--bg-card); color: var(--text-main);">
                <h5 class="fw-bold mb-3" style="color: var(--accent-color);">My Activity & Interactions</h5>
        `;
        if (userActivities.length === 0) {
            activityHtml += `<p class="small mb-0" style="color: var(--text-main); opacity: 0.85;">No recent activities or interactions found.</p>`;
        } else {
            activityHtml += `<ul class="list-unstyled mb-0 d-flex flex-column gap-3">`;
            userActivities.forEach(act => {
                const actionBtn = (act.type === 'follow' || act.type === 'post_ref') ? `
                    <button class="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style="width: 28px; height: 28px; border-color: rgba(255, 255, 255, 0.3); color: var(--accent-color);" onclick='navigateToActivity(${JSON.stringify(act)})' title="Go to Activity">
                        <i class="bi bi-box-arrow-up-right fs-6"></i>
                    </button>
                ` : '';

                activityHtml += `
                    <li class="d-flex align-items-center justify-content-between pb-2 border-bottom border-secondary">
                        <div class="d-flex align-items-start gap-3">
                            <i class="bi bi-clock-history fs-5 mt-1" style="color: var(--accent-color);"></i>
                            <div>
                                <p class="mb-1 small fw-semibold" style="color: var(--text-main);">${act.text}</p>
                                <small style="font-size: 0.7rem; color: var(--text-main); opacity: 0.7;">${act.time}</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            ${actionBtn}
                            <button class="btn btn-sm btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style="width: 28px; height: 28px; border-color: rgba(220, 53, 69, 0.4);" onclick="removeActivityItem(${act.id})" title="Delete Activity Item">
                                <i class="bi bi-trash fs-6"></i>
                            </button>
                        </div>
                    </li>
                `;
            });
            activityHtml += `</ul>`;
        }
        activityHtml += `</div>`;
        feedContainer.innerHTML = activityHtml;
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
        const avatarHtml = userPhotoUrl ? `<img src="${userPhotoUrl}" alt="Profile" class="w-100 h-100 object-fit-cover">` : `<span style="color: var(--accent-color);">${authorName[0]}</span>`;
        const musicHtml = post.music ? `<span class="mx-1">•</span><span style="color: var(--accent-color);"><i class="bi bi-music-note me-1"></i>${post.music}</span>` : '';
        const captionHtml = post.caption ? `
            <p class="card-text mb-2" id="captionText${currentId}" style="font-size: 0.95rem;">
                <strong class="me-1" style="color: var(--text-main);">${authorName}</strong><span id="captionContent${currentId}">${post.caption}</span>
            </p>
        ` : `<p class="card-text mb-2" id="captionText${currentId}" style="font-size: 0.95rem; display:none;"></p>`;

        let mediaHtml = '';
        if (post.media_url) {
            if (post.is_video) {
                mediaHtml = `<video src="${post.media_url}" class="w-100 h-100 object-fit-cover position-absolute" style="top:0; left:0;" controls ${post.is_muted ? 'muted' : ''}></video>`;
            } else {
                mediaHtml = `<img src="${post.media_url}" class="w-100 h-100 object-fit-cover position-absolute" style="top:0; left:0;">`;
            }
        }

        const isFollowing = followingState[authorName] || false;
        const followBtnText = isFollowing ? 'Following' : 'Follow';
        const followBtnStyle = isFollowing ? 
            'background-color: var(--accent-color); color: #111; border-color: var(--accent-color);' : 
            'background-color: transparent; color: var(--accent-color); border-color: var(--accent-color);';

        const isLiked = likedState[currentId] || false;
        const heartIconClass = isLiked ? 'bi-heart-fill text-danger' : 'bi-heart';
        const formattedDate = formatSimpleDate(post.created_at);

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

        const newPostHtml = `
            <div class="card rounded-4 shadow-sm mb-4 border-secondary" id="postCard${currentId}" style="background-color: var(--bg-card); color: var(--text-main);">
                <div class="card-header bg-transparent border-0 d-flex align-items-center justify-content-between p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle overflow-hidden d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0" style="width: 42px; height: 42px; border: 1.5px solid var(--accent-color); color: var(--text-main);">
                            ${avatarHtml}
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <div class="d-flex align-items-center gap-2">
                                <h6 class="fw-bold mb-0 lh-1" style="font-size: 0.95rem; color: var(--text-main);">${authorName}</h6>
                                <button class="btn btn-sm rounded-pill py-0 px-2 follow-btn" style="font-size: 0.7rem; ${followBtnStyle}" onclick="toggleFollowUser('${authorName}', this)">${followBtnText}</button>
                            </div>
                            <div class="d-flex align-items-center gap-1 mt-1" style="font-size: 0.72rem; line-height: 1; color: var(--text-muted);">
                                <span>${formattedDate}</span>
                                ${musicHtml}
                            </div>
                        </div>
                    </div>
                    
                    <div class="dropdown">
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
                    </div>
                </div>

                ${mediaHtml ? `
                    <div class="position-relative bg-black overflow-hidden" style="height: 280px;">
                        ${mediaHtml}
                        <button class="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center opacity-75 shadow-sm" style="width: 34px; height: 34px; background-color: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2);" onclick="toggleFeedAudio(this)">
                            <i class="bi bi-volume-mute-fill text-light" style="font-size: 1rem;"></i>
                        </button>
                    </div>
                ` : ''}

                <div class="card-body py-3">
                    <div class="d-flex align-items-center gap-3 mb-2">
                        <button class="btn btn-sm p-0 d-flex align-items-center gap-1 fs-5" style="color: inherit;" onclick="toggleLikePost(${currentId}, '${authorName}', this)">
                            <i class="bi ${heartIconClass}"></i>
                        </button>
                        <button class="btn btn-sm p-0 d-flex align-items-center gap-1 fs-5" style="color: var(--accent-color) !important;" data-bs-toggle="collapse" data-bs-target="#commentsPost${currentId}">
                            <i class="bi bi-chat"></i>
                        </button>
                        <button class="btn btn-sm p-0 ms-auto fs-5" style="color: var(--text-main);">
                            <i class="bi bi-bookmark"></i>
                        </button>
                    </div>
                    <div class="fw-bold mb-1" style="font-size: 0.85rem; color: var(--accent-color);">0 likes</div>
                    ${captionHtml}
                    
                    <div class="collapse pt-2 mt-2 border-top border-secondary" id="editPost${currentId}">
                        <label class="form-label small mb-1" style="color: var(--text-muted);">Edit Caption</label>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control text-light border-secondary" id="editInput${currentId}" value="${post.caption || ''}" style="background-color: rgba(0,0,0,0.4) !important; font-size: 0.85rem; color: var(--text-main) !important;">
                            <button class="btn btn-outline-secondary" type="button" onclick="const val = document.getElementById('editInput${currentId}').value; const el = document.getElementById('captionText${currentId}'); el.style.display='block'; el.innerHTML = '<strong class=\\'me-1\\' style=\\'color: var(--text-main);\\'>${authorName}</strong>' + val; bootstrap.Collapse.getInstance(document.getElementById('editPost${currentId}')).hide();" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);">Save</button>
                        </div>
                    </div>

                    <div class="collapse pt-2 mt-2 border-top border-secondary" id="commentsPost${currentId}">
                        <div class="mb-2 comments-container" style="max-height: 150px; overflow-y: auto;">
                            ${commentsListHtml || '<small class="text-muted">No comments yet. Be the first to comment!</small>'}
                        </div>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control text-light border-secondary" id="commentInput${currentId}" placeholder="Add a comment..." style="background-color: rgba(0,0,0,0.4) !important; font-size: 0.85rem; color: var(--text-main) !important;">
                            <button class="btn btn-outline-secondary" type="button" onclick="addComment(${currentId}, '${authorName}', document.getElementById('commentInput${currentId}'))" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);"><i class="bi bi-send"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        feedContainer.insertAdjacentHTML('beforeend', newPostHtml);
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
    const music = document.getElementById('musicSelect').value;
    const isMuted = document.getElementById('muteVideoSwitch').checked;

    const formData = new FormData();
    formData.append('media_file', uploadedFileObject);
    formData.append('caption', caption);
    formData.append('music', music);
    formData.append('is_muted', isMuted);

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
            document.getElementById('previewContainer').innerHTML = 'No photo or video selected';
            document.getElementById('previewCaption').innerHTML = '';
            document.getElementById('previewMusic').innerHTML = 'Preview Mode';
            document.getElementById('cropControls').classList.add('d-none');
            document.getElementById('muteVideoOption').classList.add('d-none');
            uploadedMediaUrl = null;
            uploadedFileObject = null;
            isVideoMedia = false;
            
            const modalEl = document.getElementById('createPostModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
        }
    });
}