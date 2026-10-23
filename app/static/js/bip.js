let uploadedMediaUrl = null;
let isVideoMedia = false;
const userPhotoUrl = window.userProfilePhotoUrl || "";

let zoomLevel = 100;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;
let postCounter = 1;

let audioCtx = null;
let synthOsc = null;

function openStoryModal() {
    document.getElementById('postTypeSelect').value = 'story';
    document.getElementById('modalHeaderTitle').innerText = 'Create New Story (24h)';
    document.getElementById('submitBtnText').innerText = 'Publish Story';
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function openFeedModal() {
    document.getElementById('postTypeSelect').value = 'feed';
    document.getElementById('modalHeaderTitle').innerText = 'Create New Publication';
    document.getElementById('submitBtnText').innerText = 'Publish to BIP';
    const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
    modal.show();
}

function updatePreview() {
    const text = document.getElementById('captionInput').value;
    const music = document.getElementById('musicSelect').value;
    const previewCap = document.getElementById('previewCaption');
    const previewMusic = document.getElementById('previewMusic');

    if (text.trim() !== "") {
        previewCap.innerHTML = `<strong class="text-light me-1">Marcelo Stobbe</strong>${text}`;
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

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        const card = document.getElementById(postId);
        if (card) {
            card.remove();
            
            const feedContainer = document.getElementById('feed-container');
            if (feedContainer && feedContainer.querySelectorAll('.card').length === 0) {
                let emptyMsg = document.getElementById('noPostsYetMessage');
                if (!emptyMsg) {
                    feedContainer.innerHTML = `
                        <div id="noPostsYetMessage" class="text-center py-5 text-muted">
                            <i class="bi bi-camera fs-1 d-block mb-2" style="color: var(--accent-color); opacity: 0.5;"></i>
                            <p class="small">No posts in your feed yet. Create your first publication using the button below!</p>
                        </div>
                    `;
                }
            }
        }
    }
}

function handlePostSubmit(e) {
    e.preventDefault();
    const caption = document.getElementById('captionInput').value;
    const mode = document.getElementById('postTypeSelect').value;
    const music = document.getElementById('musicSelect').value;
    const isMuted = document.getElementById('muteVideoSwitch').checked;
    const currentId = postCounter++;

    if (mode === 'story') {
        const storiesBar = document.getElementById('stories-bar');
        const mediaThumbnail = uploadedMediaUrl ? `<img src="${uploadedMediaUrl}" class="rounded-circle w-100 h-100 object-fit-cover">` : `<span class="text-light fw-bold" style="font-size: 0.85rem;">M</span>`;
        
        const newStoryHtml = `
            <div class="text-center flex-shrink-0" style="cursor: pointer;" onclick="alert('Viewing your active story...')">
                <div class="rounded-circle p-1 d-flex align-items-center justify-content-center mx-auto mb-1" style="width: 64px; height: 64px; border: 2px solid var(--accent-color); background: linear-gradient(45deg, var(--accent-color), #00ff66);">
                    <div class="rounded-circle p-0.5 w-100 h-100 overflow-hidden bg-dark d-flex align-items-center justify-content-center">
                        ${mediaThumbnail}
                    </div>
                </div>
                <small class="text-light text-truncate d-block" style="font-size: 0.75rem; max-width: 64px;">My Story</small>
            </div>
        `;
        storiesBar.insertAdjacentHTML('beforeend', newStoryHtml);
        alert('Story published successfully! It is now visible on your stories bar.');
    } else {
        const feedContainer = document.getElementById('feed-container');
        
        const emptyMsg = document.getElementById('noPostsYetMessage');
        if (emptyMsg) {
            emptyMsg.remove();
        }
        
        let mediaHtml = '';
        if (uploadedMediaUrl) {
            const transformStyle = `transform: scale(${zoomLevel / 100}) translate(${panX}px, ${panY}px);`;
            if (isVideoMedia) {
                mediaHtml = `<video src="${uploadedMediaUrl}" class="w-100 h-100 object-fit-cover position-absolute" style="${transformStyle}" controls autoplay ${isMuted ? 'muted' : ''}></video>`;
            } else {
                mediaHtml = `<img src="${uploadedMediaUrl}" class="w-100 h-100 object-fit-cover position-absolute" style="${transformStyle}">`;
            }
        }

        const avatarHtml = userPhotoUrl ? `<img src="${userPhotoUrl}" alt="Profile" class="w-100 h-100 object-fit-cover">` : `<span style="color: var(--accent-color);">M</span>`;
        const musicHtml = music ? `<span class="mx-1">•</span><span style="color: var(--accent-color);"><i class="bi bi-music-note me-1"></i>${music}</span>` : '';
        
        const captionHtml = caption.trim() !== "" ? `
            <p class="card-text mb-2" id="captionText${currentId}" style="font-size: 0.95rem;">
                <strong class="text-light me-1">Marcelo Stobbe</strong><span id="captionContent${currentId}">${caption}</span>
            </p>
        ` : `<p class="card-text mb-2" id="captionText${currentId}" style="font-size: 0.95rem; display:none;"></p>`;

        const newPostHtml = `
            <div class="card rounded-4 shadow-sm mb-4 border-secondary text-light" id="postCard${currentId}" style="background-color: var(--bg-card);">
                <div class="card-header bg-transparent border-0 d-flex align-items-center justify-content-between p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle overflow-hidden d-flex align-items-center justify-content-center fw-bold text-light shadow-sm flex-shrink-0" style="width: 42px; height: 42px; border: 1.5px solid var(--accent-color);">
                            ${avatarHtml}
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="fw-bold mb-0 text-light lh-1" style="font-size: 0.95rem;">Marcelo Stobbe</h6>
                            <div class="d-flex align-items-center gap-1 mt-1 text-muted" style="font-size: 0.72rem; line-height: 1;">
                                <span>Just now</span>
                                ${musicHtml}
                            </div>
                        </div>
                    </div>
                    
                    <div class="dropdown">
                        <button class="btn btn-sm btn-link text-light p-1 border-0 dropdown-toggle-no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Post Options">
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
                    <div class="position-relative bg-black overflow-hidden" style="height: 380px;">
                        ${mediaHtml}
                        <button class="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 m-3 p-0 d-flex align-items-center justify-content-center opacity-75 shadow-sm" style="width: 34px; height: 34px; background-color: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2);" onclick="toggleFeedAudio(this)">
                            <i class="bi bi-volume-mute-fill text-light" style="font-size: 1rem;"></i>
                        </button>
                    </div>
                ` : ''}

                <div class="card-body py-3">
                    <div class="d-flex align-items-center gap-3 mb-2">
                        <button class="btn btn-sm p-0 text-danger d-flex align-items-center gap-1 fs-5" onclick="this.querySelector('i').classList.toggle('bi-heart'); this.querySelector('i').classList.toggle('bi-heart-fill');">
                            <i class="bi bi-heart"></i>
                        </button>
                        <button class="btn btn-sm p-0 text-light d-flex align-items-center gap-1 fs-5" style="color: var(--accent-color) !important;" data-bs-toggle="collapse" data-bs-target="#commentsPost${currentId}">
                            <i class="bi bi-chat"></i>
                        </button>
                        <button class="btn btn-sm p-0 text-light ms-auto fs-5">
                            <i class="bi bi-bookmark"></i>
                        </button>
                    </div>
                    <div class="fw-bold mb-1" style="font-size: 0.85rem; color: var(--accent-color);">0 likes</div>
                    ${captionHtml}
                    
                    <div class="collapse pt-2 mt-2 border-top border-secondary" id="editPost${currentId}">
                        <label class="form-label text-muted small mb-1">Edit Caption</label>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control bg-dark text-light border-secondary" id="editInput${currentId}" value="${caption}" style="background-color: #000000 !important; font-size: 0.85rem;">
                            <button class="btn btn-outline-secondary" type="button" onclick="const val = document.getElementById('editInput${currentId}').value; const el = document.getElementById('captionText${currentId}'); el.style.display='block'; el.innerHTML = '<strong class=\\'text-light me-1\\'>Marcelo Stobbe</strong>' + val; bootstrap.Collapse.getInstance(document.getElementById('editPost${currentId}')).hide();" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);">Save</button>
                        </div>
                    </div>

                    <div class="collapse pt-2 mt-2 border-top border-secondary" id="commentsPost${currentId}">
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control bg-dark text-light border-secondary" placeholder="Add a comment..." style="background-color: #000000 !important; font-size: 0.85rem;">
                            <button class="btn btn-outline-secondary" type="button" style="border-color: rgba(255,255,255,0.2); color: var(--accent-color);"><i class="bi bi-send"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        feedContainer.insertAdjacentHTML('afterbegin', newPostHtml);
    }

    document.getElementById('postForm').reset();
    document.getElementById('previewContainer').innerHTML = 'No photo or video selected';
    document.getElementById('previewCaption').innerHTML = '';
    document.getElementById('previewMusic').innerHTML = 'Preview Mode';
    document.getElementById('cropControls').classList.add('d-none');
    document.getElementById('muteVideoOption').classList.add('d-none');
    uploadedMediaUrl = null;
    isVideoMedia = false;
    
    const modalEl = document.getElementById('createPostModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
}