document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('profile_photo');
    const triggerBtn = document.getElementById('triggerPhotoSelectBtn');
    const previewCircle = document.getElementById('photoPreviewCircle');
    const canvas = document.getElementById('photoCropCanvas');
    const zoomControls = document.getElementById('photoZoomControls');
    const zoomSlider = document.getElementById('photoZoomSlider');
    const existingImg = document.getElementById('existingProfileImg');
    const placeholderIcon = document.getElementById('photoPlaceholderIcon');
    const profileForm = document.getElementById('profileForm');

    if (!fileInput || !triggerBtn || !previewCircle || !canvas || !profileForm) {
        return;
    }

    const ctx = canvas.getContext('2d');

    let loadedImage = null;
    let hasNewImage = false;
    let scale = 1;
    let minScale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    triggerBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                loadedImage = img;
                hasNewImage = true;

                const size = canvas.width;
                minScale = Math.max(size / img.width, size / img.height);
                scale = minScale;
                zoomSlider.min = minScale.toFixed(3);
                zoomSlider.max = (minScale * 3).toFixed(3);
                zoomSlider.step = (minScale * 0.02).toFixed(4);
                zoomSlider.value = scale;

                offsetX = (size - img.width * scale) / 2;
                offsetY = (size - img.height * scale) / 2;

                if (existingImg) existingImg.classList.add('d-none');
                if (placeholderIcon) placeholderIcon.classList.add('d-none');
                canvas.classList.remove('d-none');
                zoomControls.classList.remove('d-none');
                triggerBtn.innerHTML = '<i class="bi bi-camera-fill me-1"></i> Change Photo';

                drawPreview();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    function clampOffsets() {
        if (!loadedImage) return;
        const size = canvas.width;
        const drawnW = loadedImage.width * scale;
        const drawnH = loadedImage.height * scale;

        if (offsetX > 0) offsetX = 0;
        if (offsetY > 0) offsetY = 0;
        if (offsetX < size - drawnW) offsetX = size - drawnW;
        if (offsetY < size - drawnH) offsetY = size - drawnH;
    }

    function drawPreview() {
        if (!loadedImage) return;
        const size = canvas.width;
        clampOffsets();
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(
            loadedImage,
            offsetX,
            offsetY,
            loadedImage.width * scale,
            loadedImage.height * scale
        );
    }

    zoomSlider.addEventListener('input', () => {
        if (!loadedImage) return;
        const size = canvas.width;
        const prevScale = scale;
        const nextScale = parseFloat(zoomSlider.value);

        const centerX = size / 2;
        const centerY = size / 2;
        offsetX = centerX - ((centerX - offsetX) / prevScale) * nextScale;
        offsetY = centerY - ((centerY - offsetY) / prevScale) * nextScale;

        scale = nextScale;
        drawPreview();
    });

    previewCircle.addEventListener('wheel', (e) => {
        if (!hasNewImage || !loadedImage) return;
        e.preventDefault();
        const step = parseFloat(zoomSlider.step) * 3;
        const nextVal = Math.min(
            parseFloat(zoomSlider.max),
            Math.max(parseFloat(zoomSlider.min), scale + (e.deltaY < 0 ? step : -step))
        );
        zoomSlider.value = nextVal;
        zoomSlider.dispatchEvent(new Event('input'));
    }, { passive: false });

    previewCircle.addEventListener('mousedown', (e) => {
        if (!hasNewImage) return;
        isDragging = true;
        previewCircle.style.cursor = 'grabbing';
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        drawPreview();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        previewCircle.style.cursor = 'grab';
    });

    previewCircle.addEventListener('touchstart', (e) => {
        if (!hasNewImage || e.touches.length !== 1) return;
        isDragging = true;
        dragStartX = e.touches[0].clientX - offsetX;
        dragStartY = e.touches[0].clientY - offsetY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        offsetX = e.touches[0].clientX - dragStartX;
        offsetY = e.touches[0].clientY - dragStartY;
        drawPreview();
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    profileForm.addEventListener('submit', (e) => {
        if (!hasNewImage || !loadedImage) return;
        e.preventDefault();

        const exportSize = 400;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = exportSize;
        exportCanvas.height = exportSize;
        const exportCtx = exportCanvas.getContext('2d');
        const ratio = exportSize / canvas.width;

        exportCtx.drawImage(
            loadedImage,
            offsetX * ratio,
            offsetY * ratio,
            loadedImage.width * scale * ratio,
            loadedImage.height * scale * ratio
        );

        exportCanvas.toBlob((blob) => {
            if (blob) {
                const croppedFile = new File([blob], 'profile_photo.png', { type: 'image/png' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(croppedFile);
                fileInput.files = dataTransfer.files;
            }
            profileForm.submit();
        }, 'image/png', 0.95);
    });
});