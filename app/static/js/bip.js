let uploadedMediaUrl = null;
let uploadedFileObject = null;
let isVideoMedia = false;
let mediaNaturalWidth = 0;
let mediaNaturalHeight = 0;

const userPhotoUrl = window.userProfilePhotoUrl || "";
const currentLoggedInUserName = window.currentUserName || "Marcelo Stobbe";

let zoomLevel = 100;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragPointerType = null;
let startX = 0;
let startY = 0;

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

let isSubmittingPost = false;
let activeSubmissionKey = null;

let feedAudioEnabled = false;
let feedObserver = null;
let activeFeedMediaBox = null;

document.addEventListener('DOMContentLoaded', () => {
    initPageShell();
    bindStaticControls();
    renderContent();
    renderServerStories();
    bindStoryViewerLifecycle();
    bindModalLifecycle();
});

function initPageShell() {
    document.body.classList.add('bip-page');
    const footerCandidates = document.querySelectorAll('footer, .footer, #footer, .app-footer');
    footerCandidates.forEach(el => {
        if (!el.closest('#bipBottomNav')) {
            el.remove();
        }
    });
}

function stopAllFeedAudio() {
    const allBoxes = document.querySelectorAll('.bip-feed-media-box');
    allBoxes.forEach(box => {
        const audioEl = box.querySelector('audio');
        const videoEl = box.querySelector('video');
        const btn = box.querySelector('.bip-feed-audio-btn');
        const icon = btn ? btn.querySelector('i') : null;

        if (audioEl) {
            try {
                audioEl.pause();
            } catch (err) {}
        }
        if (videoEl) {
            videoEl.muted = true;
        }
        if (icon) {
            icon.className = 'bi bi-volume-mute-fill text-light';
        }
    });
}

function bindStaticControls() {
    const addStoryTrigger = document.getElementById('addStoryTrigger');
    if (addStoryTrigger) {
        addStoryTrigger.addEventListener('click', () => {
            stopAllFeedAudio();
            openStoryModal();
        });
    }

    const navHomeBtn = document.getElementById('navHomeBtn');
    if (navHomeBtn) {
        navHomeBtn.addEventListener('click', () => {
            stopAllFeedAudio();
            switchTab('home');
        });
    }

    const navFollowingBtn = document.getElementById('navFollowingBtn');
    if (navFollowingBtn) {
        navFollowingBtn.addEventListener('click', () => {
            stopAllFeedAudio();
            switchTab('following');
        });
    }

    const navCreatePostBtn = document.getElementById('navCreatePostBtn');
    if (navCreatePostBtn) {
        navCreatePostBtn.addEventListener('click', () => {
            stopAllFeedAudio();
            openFeedModal();
        });
    }

    const navActivityBtn = document.getElementById('navActivityBtn');
    if (navActivityBtn) {
        navActivityBtn.addEventListener('click', () => {
            stopAllFeedAudio();
            switchTab('activity');
        });
    }

    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    const mediaInput = document.getElementById('mediaInput');
    if (mediaInput) {
        mediaInput.addEventListener('change', previewMedia);
    }

    const zoomRange = document.getElementById('zoomRange');
    if (zoomRange) {
        zoomRange.addEventListener('input', applyMediaTransform);
    }

    const muteVideoSwitch = document.getElementById('muteVideoSwitch');
    if (muteVideoSwitch) {
        muteVideoSwitch.addEventListener('change', toggleVideoMute);
    }

    const musicSearchInput = document.getElementById('musicSearchInput');
    if (musicSearchInput) {
        musicSearchInput.addEventListener('input', (e) => searchMusicTracks(e.target.value));
    }

    const captionInput = document.getElementById('captionInput');
    if (captionInput) {
        captionInput.addEventListener('input', updatePreview);
    }

    const previewAudioBtn = document.getElementById('previewAudioBtn');
    if (previewAudioBtn) {
        previewAudioBtn.addEventListener('click', togglePreviewAudio);
    }

    const prevStoryBtn = document.getElementById('prevStoryBtn');
    if (prevStoryBtn) {
        prevStoryBtn.addEventListener('click', prevStory);
    }

    const nextStoryBtn = document.getElementById('nextStoryBtn');
    if (nextStoryBtn) {
        nextStoryBtn.addEventListener('click', nextStory);
    }

    const deleteStoryOptionBtn = document.getElementById('deleteStoryOptionBtn');
    if (deleteStoryOptionBtn) {
        deleteStoryOptionBtn.addEventListener('click', confirmDeleteStory);
    }

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', executeDelete);
    }
}

function bindModalLifecycle() {
    const createModalEl = document.getElementById('createPostModal');
    if (createModalEl) {
        createModalEl.addEventListener('show.bs.modal', () => {
            stopAllFeedAudio();
        });
        createModalEl.addEventListener('hidden.bs.modal', () => {
            stopPreviewAudio();
        });
    }
}

function stopPreviewAudio() {
    const audioEl = document.getElementById('previewAudioPlayer');
    const btn = document.getElementById('previewAudioBtn');
    if (audioEl) {
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
        } catch (err) {
        }
    }
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'bi bi-volume-mute-fill';
    }
}

function syncPreviewAudioButton() {
    const btn = document.getElementById('previewAudioBtn');
    const audioEl = document.getElementById('previewAudioPlayer');
    if (!btn || !audioEl) return;

    if (selectedMusicPreviewUrl) {
        btn.classList.remove('d-none');
        btn.classList.add('d-flex');
        audioEl.src = selectedMusicPreviewUrl;
    } else {
        stopPreviewAudio();
        audioEl.removeAttribute('src');
        btn.classList.add('d-none');
        btn.classList.remove('d-flex');
    }
}

function togglePreviewAudio() {
    const audioEl = document.getElementById('previewAudioPlayer');
    const btn = document.getElementById('previewAudioBtn');
    if (!audioEl || !selectedMusicPreviewUrl) return;

    const icon = btn ? btn.querySelector('i') : null;
    if (!audioEl.src) {
        audioEl.src = selectedMusicPreviewUrl;
    }

    if (audioEl.paused) {
        audioEl.loop = true;
        audioEl.play().then(() => {
            if (icon) icon.className = 'bi bi-volume-up-fill';
        }).catch(() => {});
    } else {
        audioEl.pause();
        if (icon) icon.className = 'bi bi-volume-mute-fill';
    }
}

function stopActiveStoryAudio() {
    const mediaContainer = document.getElementById('storyMediaContent');
    if (!mediaContainer) return;

    const audios = mediaContainer.querySelectorAll('audio');
    audios.forEach(audioEl => {
        try {
            audioEl.pause();
            audioEl.currentTime = 0;
            audioEl.removeAttribute('src');
            audioEl.load();
        } catch (err) {
        }
    });

    const videos = mediaContainer.querySelectorAll('video');
    videos.forEach(vidEl => {
        try {
            vidEl.pause();
            vidEl.currentTime = 0;
        } catch (err) {
        }
    });
}

function bindStoryViewerLifecycle() {
    const viewerModalEl = document.getElementById('storyViewerModal');
    if (!viewerModalEl) return;

    viewerModalEl.addEventListener('show.bs.modal', () => {
        stopAllFeedAudio();
        document.body.classList.add('bip-story-viewing');
    });

    viewerModalEl.addEventListener('hide.bs.modal', () => {
        stopActiveStoryAudio();
        document.body.classList.remove('bip-story-viewing');
    });

    viewerModalEl.addEventListener('hidden.bs.modal', () => {
        stopActiveStoryAudio();
        document.body.classList.remove('bip-story-viewing');
        const mediaContainer = document.getElementById('storyMediaContent');
        if (mediaContainer) {
            mediaContainer.innerHTML = '';
        }
    });
}

function setPostingState(active, labelText = 'Posting...') {
    isSubmittingPost = active;
    const banner = document.getElementById('bipPostingStatusBanner');
    const bannerText = document.getElementById('bipPostingStatusText');
    const submitBtn = document.getElementById('submitBtnText');
    const isStoryMode = document.getElementById('modalHeaderTitle').innerText.includes('Story');

    if (banner) {
        if (active) {
            if (bannerText) bannerText.innerText = labelText;
            banner.classList.remove('d-none');
        } else {
            banner.classList.add('d-none');
        }
    }

    if (submitBtn) {
        submitBtn.disabled = active;
        if (active) {
            submitBtn.innerText = isStoryMode ? 'Publishing Story...' : 'Publishing...';
        } else {
            activeSubmissionKey = null;
            submitBtn.innerText = isStoryMode ? 'Publish Story' : 'Publish to BIP';
        }
    }
}

function openStoryModal() {
    setPostingState(false);
    stopPreviewAudio();
    document.getElementById('modalHeaderTitle').innerText = 'Create New Story';
    document.getElementById('submitBtnText').innerText = 'Publish Story';
    const previewBox = document.getElementById('previewContainer');
    if (previewBox) previewBox.style.aspectRatio = '1 / 1';
    applyMediaTransform();
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function openFeedModal() {
    setPostingState(false);
    stopPreviewAudio();
    document.getElementById('modalHeaderTitle').innerText = 'Create New Publication';
    document.getElementById('submitBtnText').innerText = 'Publish to BIP';
    const previewBox = document.getElementById('previewContainer');
    if (previewBox) previewBox.style.aspectRatio = '1 / 1';
    applyMediaTransform();
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
                    item.className = 'list-group-item list-group-item-action bip-music-item small';
                    item.innerHTML = `<i class="bi bi-music-note me-2" style="color: var(--accent-color);"></i><strong>${trackName}</strong> <span class="bip-music-artist">by ${artistName}</span>`;

                    item.addEventListener('click', () => {
                        selectedMusicTrack = displayString;
                        selectedMusicPreviewUrl = previewUrl || "";
                        document.getElementById('musicSearchInput').value = displayString;
                        resultsContainer.classList.add('d-none');
                        syncPreviewAudioButton();
                        updatePreview();
                    });
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

function computeCoverDimensions(srcW, srcH, dstW, dstH) {
    const safeSrcW = srcW || dstW;
    const safeSrcH = srcH || dstH;
    const scale = Math.max(dstW / safeSrcW, dstH / safeSrcH);
    const drawW = safeSrcW * scale;
    const drawH = safeSrcH * scale;
    const centerX = (dstW - drawW) / 2;
    const centerY = (dstH - drawH) / 2;
    return { drawW, drawH, centerX, centerY };
}

function clampPanOffsets(srcW, srcH, containerW, containerH) {
    const zoomScale = zoomLevel / 100;
    const { drawW, drawH } = computeCoverDimensions(srcW, srcH, containerW, containerH);
    const scaledW = drawW * zoomScale;
    const scaledH = drawH * zoomScale;

    const maxPanX = Math.max(0, (scaledW - containerW) / 2);
    const maxPanY = Math.max(0, (scaledH - containerH) / 2);

    if (panX > maxPanX) panX = maxPanX;
    if (panX < -maxPanX) panX = -maxPanX;
    if (panY > maxPanY) panY = maxPanY;
    if (panY < -maxPanY) panY = -maxPanY;
}

function getTransformCss(srcW, srcH, containerW, containerH) {
    clampPanOffsets(srcW, srcH, containerW, containerH);
    const zoomScale = zoomLevel / 100;
    const { drawW, drawH, centerX, centerY } = computeCoverDimensions(srcW, srcH, containerW, containerH);
    const scaledW = drawW * zoomScale;
    const scaledH = drawH * zoomScale;
    const left = (containerW - scaledW) / 2 + panX;
    const top = (containerH - scaledH) / 2 + panY;

    return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${scaledW}px`,
        height: `${scaledH}px`,
        transform: 'none'
    };
}

function previewMedia(event) {
    const file = event.target.files[0];
    const container = document.getElementById('previewContainer');
    const cropControls = document.getElementById('cropControls');
    const muteOption = document.getElementById('muteVideoOption');

    zoomLevel = 100;
    panX = 0;
    panY = 0;
    mediaNaturalWidth = 0;
    mediaNaturalHeight = 0;
    document.getElementById('zoomRange').value = 100;
    document.getElementById('zoomVal').innerText = "100%";

    if (file) {
        uploadedFileObject = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedMediaUrl = e.target.result;
            cropControls.classList.remove('d-none');

            container.innerHTML = '';
            const cW = container.clientWidth || 360;
            const cH = container.clientHeight || 360;

            if (file.type.startsWith('video/')) {
                isVideoMedia = true;
                muteOption.classList.remove('d-none');
                const isMuted = document.getElementById('muteVideoSwitch').checked;

                const videoEl = document.createElement('video');
                videoEl.id = 'transformableMedia';
                videoEl.src = e.target.result;
                videoEl.className = 'position-absolute';
                videoEl.controls = true;
                videoEl.autoplay = true;
                videoEl.muted = isMuted;
                videoEl.addEventListener('loadedmetadata', () => {
                    mediaNaturalWidth = videoEl.videoWidth || cW;
                    mediaNaturalHeight = videoEl.videoHeight || cH;
                    applyMediaTransform();
                });
                container.appendChild(videoEl);
            } else {
                isVideoMedia = false;
                muteOption.classList.add('d-none');

                const imgEl = document.createElement('img');
                imgEl.id = 'transformableMedia';
                imgEl.className = 'position-absolute';
                imgEl.draggable = false;
                imgEl.addEventListener('load', () => {
                    mediaNaturalWidth = imgEl.naturalWidth || cW;
                    mediaNaturalHeight = imgEl.naturalHeight || cH;
                    applyMediaTransform();
                });
                imgEl.src = e.target.result;
                container.appendChild(imgEl);
            }
            initDragEvents(container);
        };
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
    zoomLevel = parseFloat(document.getElementById('zoomRange').value) || 100;
    document.getElementById('zoomVal').innerText = Math.round(zoomLevel) + "%";
    const media = document.getElementById('transformableMedia');
    const container = document.getElementById('previewContainer');
    if (media && container) {
        const cW = container.clientWidth || 360;
        const cH = container.clientHeight || 360;
        const styles = getTransformCss(mediaNaturalWidth, mediaNaturalHeight, cW, cH);
        media.style.left = styles.left;
        media.style.top = styles.top;
        media.style.width = styles.width;
        media.style.height = styles.height;
        media.style.transform = styles.transform;
    }
}

function initDragEvents(container) {
    container.onmousedown = (e) => {
        if (!uploadedMediaUrl) return;
        isDragging = true;
        dragPointerType = 'mouse';
        container.style.cursor = 'grabbing';
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    };

    window.onmousemove = (e) => {
        if (!isDragging || dragPointerType !== 'mouse') return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyMediaTransform();
    };

    window.onmouseup = () => {
        if (!isDragging || dragPointerType !== 'mouse') return;
        isDragging = false;
        dragPointerType = null;
        container.style.cursor = 'grab';
    };

    container.ontouchstart = (e) => {
        if (!uploadedMediaUrl || e.touches.length !== 1) return;
        isDragging = true;
        dragPointerType = 'touch';
        startX = e.touches[0].clientX - panX;
        startY = e.touches[0].clientY - panY;
    };

    container.ontouchmove = (e) => {
        if (!isDragging || dragPointerType !== 'touch' || e.touches.length !== 1) return;
        e.preventDefault();
        panX = e.touches[0].clientX - startX;
        panY = e.touches[0].clientY - startY;
        applyMediaTransform();
    };

    container.ontouchend = () => {
        if (!isDragging || dragPointerType !== 'touch') return;
        isDragging = false;
        dragPointerType = null;
    };
}

function toggleVideoMute() {
    const videoTag = document.getElementById('transformableMedia');
    const isMuted = document.getElementById('muteVideoSwitch').checked;
    if (videoTag && isVideoMedia) {
        videoTag.muted = isMuted;
    }
}

function silenceAllFeedMedia(exceptBox = null) {
    const allBoxes = document.querySelectorAll('.bip-feed-media-box');
    allBoxes.forEach(box => {
        if (exceptBox && box === exceptBox) return;
        const audioEl = box.querySelector('audio');
        const videoEl = box.querySelector('video');
        const btn = box.querySelector('.bip-feed-audio-btn');
        const icon = btn ? btn.querySelector('i') : null;

        if (audioEl) {
            try {
                audioEl.pause();
            } catch (err) {}
        }
        if (videoEl) {
            videoEl.muted = true;
        }
        if (icon) {
            icon.className = 'bi bi-volume-mute-fill text-light';
        }
    });
}

function activateFeedMediaBox(box, forcePlay) {
    if (!box) return;
    silenceAllFeedMedia(box);
    activeFeedMediaBox = box;

    const audioEl = box.querySelector('audio');
    const videoEl = box.querySelector('video');
    const btn = box.querySelector('.bip-feed-audio-btn');
    const icon = btn ? btn.querySelector('i') : null;

    if (videoEl) {
        videoEl.muted = !feedAudioEnabled;
    }

    if (audioEl) {
        if (feedAudioEnabled && forcePlay) {
            audioEl.play().then(() => {
                if (icon) icon.className = 'bi bi-volume-up-fill text-light';
            }).catch(() => {});
        } else {
            audioEl.pause();
            if (icon) icon.className = 'bi bi-volume-mute-fill text-light';
        }
    } else if (videoEl && icon) {
        icon.className = feedAudioEnabled ? 'bi bi-volume-up-fill text-light' : 'bi bi-volume-mute-fill text-light';
    }
}

function toggleFeedAudio(btn) {
    const container = btn.closest('.bip-feed-media-box');
    if (!container) return;

    feedAudioEnabled = !feedAudioEnabled;

    if (!feedAudioEnabled) {
        silenceAllFeedMedia(null);
        return;
    }

    activateFeedMediaBox(container, true);
}

function initFeedScrollAudioObserver() {
    if (feedObserver) {
        feedObserver.disconnect();
    }

    const boxes = document.querySelectorAll('.bip-feed-media-box');
    if (!boxes.length || typeof IntersectionObserver === 'undefined') return;

    feedObserver = new IntersectionObserver((entries) => {
        if (!feedAudioEnabled) {
            silenceAllFeedMedia(null);
            return;
        }

        let bestBox = null;
        let bestRatio = 0;

        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
                bestRatio = entry.intersectionRatio;
                bestBox = entry.target;
            }
        });

        if (bestBox && bestRatio >= 0.45) {
            activeFeedMediaBox = bestBox;
            activateFeedMediaBox(bestBox, true);
        } else {
            silenceAllFeedMedia(null);
        }
    }, { threshold: [0.1, 0.45, 0.7] });

    boxes.forEach(box => feedObserver.observe(box));
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

function toggleFollowUser(authorName) {
    const isFollowing = followingState[authorName] || false;
    followingState[authorName] = !isFollowing;

    if (!isFollowing) {
        userActivities.unshift({ id: Date.now(), type: 'follow', target: authorName, text: `Started following ${authorName}`, time: 'Just now' });
    } else {
        userActivities.unshift({ id: Date.now(), type: 'follow', target: authorName, text: `Unfollowed ${authorName}`, time: 'Just now' });
    }

    renderContent();
}

function toggleLikePost(postId, authorName) {
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
    stopAllFeedAudio();
    stopActiveStoryAudio();
    currentStoryIndex = index;
    renderCurrentStory();
    const modal = new bootstrap.Modal(document.getElementById('storyViewerModal'));
    modal.show();
}

function renderCurrentStory() {
    stopActiveStoryAudio();

    const mediaContainer = document.getElementById('storyMediaContent');
    const footerContainer = document.getElementById('storyFooterContent');
    const captionEl = document.getElementById('storyCaptionText');
    const musicEl = document.getElementById('storyMusicText');
    const usernameEl = document.getElementById('viewerUsernameText');
    const timestampEl = document.getElementById('viewerTimestampText');

    const story = userStories[currentStoryIndex];
    if (story) {
        if (usernameEl) {
            usernameEl.innerText = story.author_name || currentLoggedInUserName;
        }
        if (timestampEl) {
            timestampEl.innerText = story.created_at ? formatSimpleDate(story.created_at) : 'Just now';
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
            audioEl.loop = false;
            mediaContainer.appendChild(audioEl);

            const soundBtn = document.createElement('button');
            soundBtn.type = 'button';
            soundBtn.className = 'btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center opacity-75 shadow-sm';
            soundBtn.style.cssText = 'width: 34px; height: 34px; background-color: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); z-index: 10;';
            soundBtn.addEventListener('click', () => {
                const icon = soundBtn.querySelector('i');
                if (audioEl.paused) {
                    audioEl.play().then(() => {
                        if (icon) icon.className = 'bi bi-volume-up-fill text-light';
                    }).catch(() => {});
                } else {
                    audioEl.pause();
                    if (icon) icon.className = 'bi bi-volume-mute-fill text-light';
                }
            });
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
    stopActiveStoryAudio();
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        renderCurrentStory();
    }
}

function nextStory() {
    stopActiveStoryAudio();
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
        stopActiveStoryAudio();
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
        itemDiv.addEventListener('click', () => openStoryViewerModal(0));

        const outerCircle = document.createElement('div');
        outerCircle.className = 'position-relative rounded-circle p-1 d-flex align-items-center justify-content-center mx-auto mb-1';
        outerCircle.style.width = '64px';
        outerCircle.style.height = '64px';
        outerCircle.style.border = '2px solid var(--accent-color)';
        outerCircle.style.background = 'var(--accent-color)';

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
    stopAllFeedAudio();

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
                    goBtn.type = 'button';
                    goBtn.className = 'btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm';
                    goBtn.style.cssText = 'width: 28px; height: 28px; border-color: rgba(255, 255, 255, 0.3); color: var(--accent-color);';
                    goBtn.title = 'Go to Activity';
                    goBtn.addEventListener('click', () => navigateToActivity(act));
                    goBtn.innerHTML = '<i class="bi bi-box-arrow-up-right fs-6"></i>';
                    rightDiv.appendChild(goBtn);
                }

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'btn btn-sm btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm';
                delBtn.style.cssText = 'width: 28px; height: 28px; border-color: rgba(220, 53, 69, 0.4);';
                delBtn.title = 'Delete Activity Item';
                delBtn.addEventListener('click', () => removeActivityItem(act.id));
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

    const template = document.getElementById('bipPostCardTemplate');
    feedContainer.innerHTML = '';

    postsToRender.forEach(post => {
        const currentId = post.id;
        const authorName = post.author_name && post.author_name !== 'User' ? post.author_name : currentLoggedInUserName;
        const formattedDate = formatSimpleDate(post.created_at);
        const isSelfPost = authorName === currentLoggedInUserName;
        const isFollowing = followingState[authorName] || false;
        const isLiked = likedState[currentId] || false;

        const cardFragment = template.content.cloneNode(true);
        const card = cardFragment.querySelector('.bip-post-card');
        card.id = `postCard${currentId}`;

        const avatarDiv = cardFragment.querySelector('.bip-post-avatar');
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

        const nameRow = cardFragment.querySelector('.bip-post-name-row');
        const h6 = cardFragment.querySelector('.bip-post-author');
        h6.textContent = authorName;

        if (!isSelfPost) {
            const followBtn = document.createElement('button');
            followBtn.type = 'button';
            followBtn.className = 'btn btn-sm rounded-pill py-0 px-2 follow-btn';
            followBtn.style.fontSize = '0.7rem';
            if (isFollowing) {
                followBtn.style.cssText += 'background-color: var(--accent-color); color: #111; border-color: var(--accent-color);';
                followBtn.textContent = 'Following';
            } else {
                followBtn.style.cssText += 'background-color: transparent; color: var(--accent-color); border-color: var(--accent-color);';
                followBtn.textContent = 'Follow';
            }
            followBtn.addEventListener('click', () => toggleFollowUser(authorName));
            nameRow.appendChild(followBtn);
        }

        const metaRow = cardFragment.querySelector('.bip-post-meta');
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

        const editCollapse = cardFragment.querySelector('.bip-edit-collapse');
        editCollapse.id = `editPost${currentId}`;
        const editLink = cardFragment.querySelector('.bip-edit-caption-link');
        editLink.setAttribute('data-bs-toggle', 'collapse');
        editLink.setAttribute('data-bs-target', `#editPost${currentId}`);

        const deleteLink = cardFragment.querySelector('.bip-delete-post-link');
        deleteLink.addEventListener('click', (e) => {
            e.preventDefault();
            deletePost(`postCard${currentId}`);
        });

        const mediaBox = cardFragment.querySelector('.bip-feed-media-box');
        if (post.media_url) {
            mediaBox.classList.remove('d-none');

            if (post.is_video) {
                const vid = document.createElement('video');
                vid.src = post.media_url;
                vid.className = 'w-100 h-100 object-fit-cover position-absolute';
                vid.style.cssText = 'top:0; left:0;';
                vid.controls = true;
                vid.muted = true;
                mediaBox.appendChild(vid);
            } else {
                const img = document.createElement('img');
                img.src = post.media_url;
                img.className = 'w-100 h-100 object-fit-cover position-absolute';
                img.style.cssText = 'top:0; left:0;';
                mediaBox.appendChild(img);
            }

            if (post.music_preview_url || post.is_video) {
                if (post.music_preview_url) {
                    const audioEl = document.createElement('audio');
                    audioEl.src = post.music_preview_url;
                    audioEl.loop = true;
                    mediaBox.appendChild(audioEl);
                }

                const soundBtn = document.createElement('button');
                soundBtn.type = 'button';
                soundBtn.className = 'btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center opacity-75 shadow-sm bip-feed-audio-btn';
                soundBtn.style.cssText = 'width: 34px; height: 34px; background-color: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); z-index: 10;';
                soundBtn.addEventListener('click', () => toggleFeedAudio(soundBtn));
                soundBtn.innerHTML = `<i class="bi ${feedAudioEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'} text-light" style="font-size: 1rem;"></i>`;
                mediaBox.appendChild(soundBtn);
            }
        }

        const likeBtn = cardFragment.querySelector('.bip-like-btn');
        const likeIcon = likeBtn.querySelector('i');
        likeIcon.className = isLiked ? 'bi bi-heart-fill text-danger' : 'bi bi-heart';
        likeBtn.addEventListener('click', () => toggleLikePost(currentId, authorName));

        const commentsCollapse = cardFragment.querySelector('.bip-comments-collapse');
        commentsCollapse.id = `commentsPost${currentId}`;
        const commentToggleBtn = cardFragment.querySelector('.bip-comment-toggle-btn');
        commentToggleBtn.setAttribute('data-bs-toggle', 'collapse');
        commentToggleBtn.setAttribute('data-bs-target', `#commentsPost${currentId}`);

        const captionP = cardFragment.querySelector('.bip-caption-text');
        captionP.id = `captionText${currentId}`;
        if (post.caption) {
            captionP.innerHTML = `<strong class="me-1" style="color: var(--text-main);">${authorName}</strong><span id="captionContent${currentId}">${post.caption}</span>`;
        } else {
            captionP.style.display = 'none';
        }

        const editInput = cardFragment.querySelector('.bip-edit-input');
        editInput.value = post.caption || '';
        const saveEditBtn = cardFragment.querySelector('.bip-save-edit-btn');
        saveEditBtn.addEventListener('click', () => {
            const val = editInput.value;
            captionP.style.display = 'block';
            captionP.innerHTML = `<strong class="me-1" style="color: var(--text-main);">${authorName}</strong>` + val;
            const inst = bootstrap.Collapse.getInstance(editCollapse);
            if (inst) inst.hide();
        });

        const commentsListEl = cardFragment.querySelector('.bip-comments-list');
        const postCommentsArr = (window.postComments && window.postComments[currentId]) ? window.postComments[currentId] : [];
        if (postCommentsArr.length === 0) {
            commentsListEl.innerHTML = '<small class="text-muted">No comments yet. Be the first to comment!</small>';
        } else {
            postCommentsArr.forEach(c => {
                const row = document.createElement('div');
                row.className = 'd-flex justify-content-between align-items-start mb-1 small';
                row.innerHTML = `<div><strong style="color: var(--accent-color);" class="me-1">${c.author}</strong><span style="color: var(--text-main);">${c.text}</span></div><span style="font-size: 0.65rem; color: var(--text-muted);">${c.time}</span>`;
                commentsListEl.appendChild(row);
            });
        }

        const commentInput = cardFragment.querySelector('.bip-comment-input');
        const commentSubmitBtn = cardFragment.querySelector('.bip-comment-submit-btn');
        commentSubmitBtn.addEventListener('click', () => addComment(currentId, authorName, commentInput));

        feedContainer.appendChild(cardFragment);
    });

    initFeedScrollAudioObserver();
}

function handlePostSubmit(e) {
    e.preventDefault();

    if (isSubmittingPost) {
        return;
    }

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

    const submissionKey = `${isStoryMode ? 'story' : 'post'}:${uploadedFileObject.name}:${uploadedFileObject.size}:${caption.trim()}:${music}`;
    if (activeSubmissionKey === submissionKey) {
        return;
    }
    activeSubmissionKey = submissionKey;
    setPostingState(true, isStoryMode ? 'Posting story...' : 'Posting publication...');

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

            const previewContainer = document.getElementById('previewContainer');
            const previewW = (previewContainer && previewContainer.clientWidth) ? previewContainer.clientWidth : 360;
            const previewH = (previewContainer && previewContainer.clientHeight) ? previewContainer.clientHeight : 360;

            clampPanOffsets(img.naturalWidth || canvas.width, img.naturalHeight || canvas.height, previewW, previewH);

            const ratioX = canvas.width / previewW;
            const ratioY = canvas.height / previewH;

            const zoomScale = zoomLevel / 100;
            const { drawW, drawH, centerX, centerY } = computeCoverDimensions(
                img.naturalWidth || canvas.width,
                img.naturalHeight || canvas.height,
                canvas.width,
                canvas.height
            );

            const finalW = drawW * zoomScale;
            const finalH = drawH * zoomScale;
            const finalX = centerX + (drawW * (1 - zoomScale)) / 2 + (panX * ratioX);
            const finalY = centerY + (drawH * (1 - zoomScale)) / 2 + (panY * ratioY);

            ctx.drawImage(img, finalX, finalY, finalW, finalH);

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
        img.onerror = () => {
            setPostingState(false);
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
            stopPreviewAudio();
            document.getElementById('postForm').reset();
            document.getElementById('musicSearchInput').value = '';
            selectedMusicTrack = "";
            selectedMusicPreviewUrl = "";
            syncPreviewAudioButton();
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
    })
    .catch(err => {
        console.error('Error submitting post/story:', err);
    })
    .finally(() => {
        setPostingState(false);
    });
}