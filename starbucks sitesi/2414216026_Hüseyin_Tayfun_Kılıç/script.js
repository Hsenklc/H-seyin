const app = {
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isMonochrome: localStorage.getItem('monochromeMode') === 'true',
    currentBgImage: localStorage.getItem('background') || "none",
    customBgImageUrl: localStorage.getItem('customBackgroundUrl') || "",
    primaryColor: "#6c5ce7",
    currentVideo: "dQw4w9WgXcQ",
    playlist: [],
    users: [],
    messages: [],
    currentUser: {
        id: "guest-" + Math.random().toString(36).substring(2, 8),
        username: "Misafir",
        role: "user",
        online: true,
        avatar: "https://i.imgur.com/8Km9tLL.png"
    },
    isPlaying: false,
    isMuted: false,
    theaterMode: false,
    currentTime: 0,
    duration: 0,
    emojis: ['😀', '😂', '😍', '😊', '👍', '🎉', '❤️', '🔥', '🥳', '🤔', '😎', '🙏', '💯', '🙌', '👀']
};

let ytPlayer;

function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API yükleniyor...");
    ytPlayer = new YT.Player('videoPlayer', {
        height: '100%',
        width: '100%',
        videoId: app.currentVideo,
        playerVars: {
            'playsinline': 1,
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log("YouTube Player API hazır ve video yüklendi.");
    updateVideoProgress();
    updateMuteButton();
    updatePlayPauseButton();
    document.querySelector('.video-yukleniyor').style.display = 'none';
}

function onPlayerStateChange(event) {
    const playerState = event.data;
    switch (playerState) {
        case YT.PlayerState.PLAYING:
            app.isPlaying = true;
            console.log("Video oynatılıyor.");
            break;
        case YT.PlayerState.PAUSED:
            app.isPlaying = false;
            console.log("Video duraklatıldı.");
            break;
        case YT.PlayerState.ENDED:
            console.log("Video bitti.");
            playNextVideo();
            break;
        case YT.PlayerState.BUFFERING:
            console.log("Video yükleniyor (buffering)...");
            document.querySelector('.video-yukleniyor').style.display = 'block';
            break;
        case YT.PlayerState.CUED:
             console.log("Video yüklendi (cued).");
             document.querySelector('.video-yukleniyor').style.display = 'none';
            break;
    }
    updatePlayPauseButton();
    if (playerState !== YT.PlayerState.BUFFERING) {
        document.querySelector('.video-yukleniyor').style.display = 'none';
    }
}

function onPlayerError(event) {
    console.error("YouTube Player Hatası:", event.data);
    showAlert(`Video oynatılırken bir hata oluştu (Kod: ${event.data}). Lütfen farklı bir video deneyin.`, 'danger');
    document.querySelector('.video-yukleniyor').style.display = 'none';
}

function updateVideoProgress() {
    if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.getDuration) {
        app.currentTime = ytPlayer.getCurrentTime() || 0;
        app.duration = ytPlayer.getDuration() || 0;

        const progressPercent = app.duration > 0 ? (app.currentTime / app.duration) * 100 : 0;
        document.querySelector('.ilerleme-cubugu').style.width = `${progressPercent}%`;

        document.querySelector('.mevcut-zaman').textContent = formatTime(app.currentTime);
        document.querySelector('.toplam-sure').textContent = formatTime(app.duration);
    }
    requestAnimationFrame(updateVideoProgress);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM yüklendi, script.js içindeki ana event listener çalışıyor.");
    initializeAppUI();
    setupEventListeners();
    loadSampleData();
});

function initializeAppUI() {
    document.body.classList.toggle('dark-mode', app.isDarkMode);
    document.body.classList.toggle('monochrome-mode', app.isMonochrome);

    if (app.customBgImageUrl) {
        document.body.style.backgroundImage = `url('${app.customBgImageUrl}')`;
        document.getElementById('customBgImageUrl').value = app.customBgImageUrl;
    } else if (app.currentBgImage && app.currentBgImage !== "none") {
        document.body.style.backgroundImage = app.currentBgImage;
    } else {
        document.body.style.backgroundImage = "none";
    }
    document.body.style.setProperty('--arka-plan-resmi', document.body.style.backgroundImage);

    document.getElementById('darkModeSwitch').checked = app.isDarkMode;
    document.getElementById('monochromeSwitch').checked = app.isMonochrome;

    document.querySelectorAll('.arkaplan-secenegi').forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-bg') === app.currentBgImage || (app.currentBgImage === "none" && option.getAttribute('data-bg') === "none")) {
            option.classList.add('selected');
        }
    });

    updatePlayPauseButton();
    updateMuteButton();
    updateUserList();
    updateUserCount();
    populateEmojiPicker();

    document.querySelector('.kullanici-avatar-yanmenu').src = app.currentUser.avatar;
    document.querySelector('.kullanici-adi-yanmenu').textContent = app.currentUser.username;
    const roomOwnerElement = document.getElementById('roomOwnerInfo');
    if(roomOwnerElement) {
        roomOwnerElement.innerHTML = `Oda Sahibi: <strong>${app.users.find(u => u.role ==='owner')?.username || 'Bilinmiyor'}</strong>`;
    }
}

function setupEventListeners() {
    const closeSettingsBtn = document.getElementById('closeSettings');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    closeSettingsBtn?.addEventListener('click', toggleSettingsPanel);
    settingsOverlay?.addEventListener('click', toggleSettingsPanel);
    saveSettingsBtn?.addEventListener('click', saveSettings);

    document.getElementById('darkModeSwitch').addEventListener('change', function() {
        app.isDarkMode = this.checked;
        document.body.classList.toggle('dark-mode', this.checked);
    });

    document.getElementById('monochromeSwitch').addEventListener('change', function() {
        app.isMonochrome = this.checked;
        document.body.classList.toggle('monochrome-mode', this.checked);
    });

    document.querySelectorAll('.arkaplan-secenegi').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelector('.arkaplan-secenegi.selected')?.classList.remove('selected');
            this.classList.add('selected');
            const bgValue = this.getAttribute('data-bg');
            app.currentBgImage = bgValue;
            app.customBgImageUrl = "";
            document.getElementById('customBgImageUrl').value = "";
            if (bgValue === "none") {
                document.body.style.backgroundImage = "none";
            } else {
                document.body.style.backgroundImage = bgValue;
            }
            document.body.style.setProperty('--arka-plan-resmi', document.body.style.backgroundImage);
        });
    });

    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('clearChatBtn').addEventListener('click', clearChat);
    document.getElementById('emojiBtn').addEventListener('click', toggleEmojiPicker);
    document.getElementById('attachmentBtn').addEventListener('click', () => {
        showAlert('Dosya ekleme özelliği henüz aktif değil.', 'info');
    });

    document.getElementById('clearPlaylistBtn').addEventListener('click', clearPlaylist);

    document.getElementById('playNowBtn').addEventListener('click', playVideoFromInput);
    document.getElementById('addToPlaylistBtn').addEventListener('click', addVideoToPlaylistFromInput);
    document.getElementById('syncBtn').addEventListener('click', syncVideo);
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('theaterModeBtn').addEventListener('click', toggleTheaterMode);

    const roomSettingsButton = document.getElementById('roomSettingsBtn');
    if(roomSettingsButton) {
        roomSettingsButton.addEventListener('click', () => {
            showAlert('Oda ayarları henüz tanımlanmadı.', 'info');
        });
    }
    
    const inviteButton = document.getElementById('inviteBtn');
    if(inviteButton) {
        inviteButton.addEventListener('click', inviteUsers);
    }

    document.querySelector('.video-ilerleme').addEventListener('click', (e) => {
        if (ytPlayer && ytPlayer.seekTo && app.duration > 0) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPositionX = e.clientX - rect.left;
            const barWidth = rect.width;
            const seekPercentage = clickPositionX / barWidth;
            const seekTime = app.duration * seekPercentage;
            ytPlayer.seekTo(seekTime, true);
            console.log(`Video ${formatTime(seekTime)} pozisyonuna sarıldı.`);
        }
    });
}

function loadSampleData() {
    app.playlist = [
        { id: "1", title: "Rick Astley - Never Gonna Give You Up", artist: "Rick Astley", source: "YouTube", videoId: "dQw4w9WgXcQ", active: true, thumbnail: `https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg`, duration: "3:32" },
        { id: "2", title: "Queen - Bohemian Rhapsody", artist: "Queen", source: "YouTube", videoId: "fJ9rUzIMcZQ", active: false, thumbnail: `https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg`, duration: "5:55" }
    ];
    updatePlaylistUI();
    if (app.playlist.length > 0) setActiveVideoInPlaylist(app.playlist[0].videoId);

    app.users = [
        { id: "1", username: "Cem", role: "owner", online: true, avatar: "https://i.imgur.com/8Km9tLL.png" },
        { id: "2", username: "Ayşe", role: "moderator", online: true, avatar: "https://i.imgur.com/JqYeSZn.png" },
        { id: "3", username: "Mehmet", role: "user", online: false, avatar: "https://i.imgur.com/mCHbV0N.png" },
        app.currentUser
    ];
    if (!app.users.some(u => u.id === app.currentUser.id)) {
        app.users.push(app.currentUser);
    }
    updateUserList();
    updateUserCount();

    app.messages = [
        { id: "msg1", userId: "1", username: "iBo", content: "Herkese merhaba! Hoş geldiniz! 👋", timestamp: Date.now() - 120000, avatar: "https://i.imgur.com/8Km9tLL.png" },
        { id: "msg2", userId: app.currentUser.id, username: app.currentUser.username, content: "Merhaba! Bu platform harika görünüyor! 😊", timestamp: Date.now() - 30000, avatar: app.currentUser.avatar }
    ];
    updateChatMessagesUI();
}

function playVideoFromInput() {
    const urlInput = document.getElementById('videoUrl');
    const url = urlInput.value.trim();

    if (url) {
        const videoId = extractVideoId(url);
        if (videoId) {
            changeVideo(videoId);
            urlInput.value = '';
            const playlistItem = app.playlist.find(item => item.videoId === videoId);
            if (playlistItem) {
                setActiveVideoInPlaylist(videoId);
            } else {
                console.log("Video playlistte bulunamadı, doğrudan oynatılıyor.");
            }
            showAlert('Video başarıyla yüklendi ve oynatılıyor!', 'success');
        } else {
            showAlert('Geçersiz YouTube linki. Lütfen doğru bir link girin.', 'danger');
        }
    } else {
        showAlert('Lütfen bir video linki girin.', 'warning');
    }
}

function addVideoToPlaylistFromInput() {
    const urlInput = document.getElementById('videoUrl');
    const url = urlInput.value.trim();

    if (url) {
        const videoId = extractVideoId(url);
        if (videoId) {
            const newVideo = {
                id: generateId(),
                title: `Yeni Video ${app.playlist.length + 1}`,
                artist: "Bilinmiyor",
                source: "YouTube",
                videoId: videoId,
                active: false,
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                duration: "0:00"
            };

            if (app.playlist.some(item => item.videoId === videoId)) {
                showAlert('Bu video zaten playlistte mevcut.', 'info');
                return;
            }

            app.playlist.push(newVideo);
            updatePlaylistUI();
            urlInput.value = '';
            showAlert('Video başarıyla playliste eklendi!', 'success');

            if (window.socket) {
                window.socket.emit('update-playlist', app.playlist);
            }
        } else {
            showAlert('Geçersiz YouTube linki. Lütfen doğru bir link girin.', 'danger');
        }
    } else {
        showAlert('Lütfen bir video linki girin.', 'warning');
    }
}

function extractVideoId(url) {
    if (!url) return null;
    let videoId = null;
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /^[a-zA-Z0-9_-]{11}$/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            videoId = match[1];
            break;
        }
    }
    return videoId;
}

function changeVideo(videoId) {
    if (ytPlayer && ytPlayer.loadVideoById) {
        console.log(`Video değiştiriliyor: ${videoId}`);
        document.querySelector('.video-yukleniyor').style.display = 'block';
        ytPlayer.loadVideoById(videoId);
        app.currentVideo = videoId;

        if (window.socket) {
            window.socket.emit('change-video', videoId);
        }
    } else {
        console.error("YouTube Player (ytPlayer) başlatılmamış veya 'loadVideoById' fonksiyonu yok.");
        const videoPlayerIframe = document.getElementById('videoPlayer');
        if (videoPlayerIframe) {
            videoPlayerIframe.src = `youtu.be{videoId}?enablejsapi=1&autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1`;
            app.currentVideo = videoId;
        }
    }
}

function togglePlayPause() {
    if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') {
        showAlert("Video oynatıcı hazır değil.", "warning");
        return;
    }
    const playerState = ytPlayer.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING || playerState === YT.PlayerState.BUFFERING) {
        ytPlayer.pauseVideo();
    } else {
        ytPlayer.playVideo();
    }
}

function updatePlayPauseButton() {
    const btn = document.getElementById('playPauseBtn');
    if (!btn) return;
    if (app.isPlaying) {
        btn.innerHTML = '<i class="fas fa-pause me-1"></i> Durdur';
        btn.classList.remove('btn-outline-success');
        btn.classList.add('btn-outline-warning');
    } else {
        btn.innerHTML = '<i class="fas fa-play me-1"></i> Oynat';
        btn.classList.remove('btn-outline-warning');
        btn.classList.add('btn-outline-success');
    }
}

function toggleMute() {
    if (ytPlayer && ytPlayer.isMuted) {
        if (ytPlayer.isMuted()) {
            ytPlayer.unMute();
            app.isMuted = false;
        } else {
            ytPlayer.mute();
            app.isMuted = true;
        }
        updateMuteButton();
    }
}

function updateMuteButton() {
    const btn = document.getElementById('muteBtn');
    if (!btn) return;
    if (app.isMuted) {
        btn.innerHTML = '<i class="fas fa-volume-up me-1"></i> Ses Aç';
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-outline-info');
    } else {
        btn.innerHTML = '<i class="fas fa-volume-mute me-1"></i> Ses Kapat';
        btn.classList.remove('btn-outline-info');
        btn.classList.add('btn-outline-secondary');
    }
}

function toggleFullscreen() {
    const body = document.body;
    const playerContainer = document.querySelector('.video-alani');

    if (!document.fullscreenElement) {
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen().catch(err => {
                showAlert(`Tam ekran açılamadı: ${err.message}`, 'danger');
            });
        } else if (playerContainer.mozRequestFullScreen) { 
            playerContainer.mozRequestFullScreen();
        } else if (playerContainer.webkitRequestFullscreen) { 
            playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.msRequestFullscreen) { 
            playerContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function toggleTheaterMode() {
    const body = document.body;
    const originalVideoParentContainer = document.querySelector('.video-oynatici-kapsayici .ana-kapsayici');
    const videoAreaElement = document.querySelector('.video-alani');
    const theaterModeBtn = document.getElementById('theaterModeBtn');

    app.theaterMode = !app.theaterMode;
    body.classList.toggle('tiyatro-modu-aktif', app.theaterMode);

    if (app.theaterMode) {
        if (!document.querySelector('.theater-mode-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'theater-mode-backdrop';
            
            videoAreaElement.classList.add('in-theater-mode'); 
            backdrop.appendChild(videoAreaElement); 
            body.appendChild(backdrop);
        }
        theaterModeBtn.innerHTML = '<i class="fas fa-compress-alt"></i>';
        showAlert('Tiyatro modu açıldı.', 'info');
    } else {
        const backdrop = document.querySelector('.theater-mode-backdrop');
        if (backdrop) {
            const videoAreaInTheater = backdrop.querySelector('.video-alani.in-theater-mode');
            if (videoAreaInTheater) {
                 originalVideoParentContainer.insertBefore(videoAreaInTheater, originalVideoParentContainer.firstChild);
                 videoAreaInTheater.classList.remove('in-theater-mode');
            }
            backdrop.remove();
        }
        theaterModeBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
        showAlert('Tiyatro modu kapatıldı.', 'info');
    }
    window.dispatchEvent(new Event('resize'));
    if(ytPlayer && ytPlayer.setSize) { 
        setTimeout(() => ytPlayer.setSize('100%', '100%'), 100);
    }
}


function syncVideo() {
    showAlert('Video senkronizasyonu özelliği henüz tam olarak ayarlanmadı.', 'info');
    if (window.socket && ytPlayer) {
        window.socket.emit('sync-video', {
            videoId: app.currentVideo,
            currentTime: ytPlayer.getCurrentTime(),
            isPlaying: app.isPlaying
        });
    }
}

function playNextVideo() {
    const currentIndex = app.playlist.findIndex(item => item.videoId === app.currentVideo);
    if (currentIndex !== -1 && currentIndex < app.playlist.length - 1) {
        const nextVideo = app.playlist[currentIndex + 1];
        changeVideo(nextVideo.videoId);
        setActiveVideoInPlaylist(nextVideo.videoId);
        showAlert(`Sıradaki video: ${nextVideo.title}`, 'info');
    } else if (currentIndex === app.playlist.length -1) {
        showAlert('Playlistteki son videoydu.', 'info');
    } else {
        app.isPlaying = false;
        updatePlayPauseButton();
    }
}

function updatePlaylistUI() {
    const container = document.getElementById('playlistItems');
    if (!container) return;

    container.innerHTML = '';
    if (app.playlist.length === 0) {
        container.innerHTML = '<li class="list-group-item text-muted text-center">Playlist boş.</li>';
        return;
    }

    app.playlist.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `list-group-item liste-ogesi d-flex justify-content-between align-items-center ${item.active ? 'active' : ''}`;
        li.setAttribute('data-video-id', item.videoId);
        li.setAttribute('data-playlist-id', item.id);

        li.innerHTML = `
            <div class="d-flex align-items-center flex-grow-1" style="cursor:pointer;">
                <span class="me-2 text-muted">${index + 1}.</span>
                <div class="liste-kucukresim me-3">
                    <img src="${item.thumbnail}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/80x45.png?text=Video';">
                </div>
                <div class="liste-bilgisi flex-grow-1">
                    <div class="liste-basligi" title="${item.title}">${item.title}</div>
                    <small class="liste-suresi text-muted">${item.duration || 'Süre bilinmiyor'}</small>
                </div>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-danger remove-playlist-item" title="Listeden kaldır">
                    <i class="fas fa-times"></i>
                </button>
                 <button class="btn btn-sm btn-outline-secondary move-playlist-item-up ms-1" title="Yukarı taşı" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary move-playlist-item-down ms-1" title="Aşağı taşı" ${index === app.playlist.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-down"></i>
                </button>
            </div>
        `;

        li.querySelector('.d-flex.align-items-center.flex-grow-1').addEventListener('click', () => {
            if (app.currentVideo !== item.videoId) {
                changeVideo(item.videoId);
            }
            setActiveVideoInPlaylist(item.videoId);
        });

        li.querySelector('.remove-playlist-item').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromPlaylist(item.id);
        });
        li.querySelector('.move-playlist-item-up').addEventListener('click', (e) => {
            e.stopPropagation();
            movePlaylistItem(index, index - 1);
        });
        li.querySelector('.move-playlist-item-down').addEventListener('click', (e) => {
            e.stopPropagation();
            movePlaylistItem(index, index + 1);
        });
        container.appendChild(li);
    });
}

function movePlaylistItem(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= app.playlist.length) {
        return;
    }
    const itemToMove = app.playlist.splice(fromIndex, 1)[0];
    app.playlist.splice(toIndex, 0, itemToMove);
    updatePlaylistUI();
    if (window.socket) {
        window.socket.emit('update-playlist', app.playlist);
    }
}

function setActiveVideoInPlaylist(videoId) {
    let foundActive = false;
    app.playlist.forEach(item => {
        item.active = (item.videoId === videoId);
        if (item.active) foundActive = true;
    });
    if (!foundActive && videoId) {
         app.playlist.forEach(item => item.active = false);
    }
    updatePlaylistUI();
}

function removeFromPlaylist(itemId) {
    const videoToRemove = app.playlist.find(item => item.id === itemId);
    app.playlist = app.playlist.filter(item => item.id !== itemId);
    updatePlaylistUI();
    showAlert(`'${videoToRemove?.title || 'Video'}' playlistten kaldırıldı.`, 'info');

    if (window.socket) {
        window.socket.emit('update-playlist', app.playlist);
    }
}

function clearPlaylist() {
    if (app.playlist.length === 0) {
        showAlert('Playlist zaten boş.', 'info');
        return;
    }
    if (confirm('Tüm playlist silinecek. Emin misiniz?')) {
        app.playlist = [];
        updatePlaylistUI();
        showAlert('Playlist temizlendi.', 'success');
        if (window.socket) {
            window.socket.emit('update-playlist', app.playlist);
        }
    }
}

function togglePlaylistVisibility() {
    console.log("togglePlaylistVisibility called");
    const section = document.getElementById('playlistSection');
    if (!section) {
        console.error("Playlist section not found!");
        return;
    }
    const isDisplayed = section.style.display !== 'none';
    section.style.display = isDisplayed ? 'none' : 'block';
    console.log("Playlist display set to:", section.style.display);

    if (section.style.display === 'block') {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}


function updateUserList() {
    const container = document.getElementById('userList');
    if (!container) return;
    container.innerHTML = '';

    if (app.users.length === 0) {
        container.innerHTML = '<li class="list-group-item text-muted text-center">Odada kimse yok.</li>';
        return;
    }

    const sortedUsers = [...app.users].sort((a, b) => {
        const roleOrder = { owner: 0, moderator: 1, user: 2 };
        if (roleOrder[a.role] !== roleOrder[b.role]) {
            return roleOrder[a.role] - roleOrder[b.role];
        }
        return a.username.localeCompare(b.username);
    });

    sortedUsers.forEach(user => {
        const li = document.createElement('li');
        li.className = `list-group-item kullanici-ogesi d-flex align-items-center kullanici-rolu-${user.role}`;
        li.setAttribute('data-user-id', user.id);

        let roleText = 'Kullanıcı';
        let roleIcon = '';
        if (user.role === 'owner') {
            roleText = 'Oda Sahibi';
            roleIcon = '<i class="fas fa-crown text-warning ms-2" title="Oda Sahibi"></i>';
        } else if (user.role === 'moderator') {
            roleText = 'Moderatör';
            roleIcon = '<i class="fas fa-shield-alt text-primary ms-2" title="Moderatör"></i>';
        }

        li.innerHTML = `
            <img src="${user.avatar || 'https://i.imgur.com/8Km9tLL.png'}" alt="${user.username}" class="kullanici-avatar me-3 rounded-circle">
            <div class="flex-grow-1">
                <div class="d-flex align-items-center">
                    <span class="cevrimici-durum ${user.online ? 'online' : 'offline'} me-2" title="${user.online ? 'Çevrimiçi' : 'Çevrimdışı'}"></span>
                    <span class="kullanici-adi fw-bold">${user.username}</span>
                    ${roleIcon}
                </div>
                <small class="text-muted kullanici-rol-metni">${roleText}</small>
            </div>
            ${user.id !== app.currentUser.id ?
            `<div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary user-actions" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Kullanıcı işlemleri">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" onclick="kickUser('${user.id}')">At</a></li>
                    <li><a class="dropdown-item" href="#" onclick="muteUser('${user.id}')">Sustur</a></li>
                    ${app.currentUser.role === 'owner' && user.role === 'user' ? `<li><a class="dropdown-item" href="#" onclick="promoteToModerator('${user.id}')">Moderatör Yap</a></li>` : ''}
                     ${app.currentUser.role === 'owner' && user.role === 'moderator' ? `<li><a class="dropdown-item" href="#" onclick="demoteToUser('${user.id}')">Kullanıcı Yap</a></li>` : ''}
                </ul>
            </div>` : ''}
        `;
        container.appendChild(li);
    });
}

function updateUserCount() {
    const countElement = document.getElementById('userCount');
    if (countElement) {
        countElement.textContent = app.users.length;
    }
}

function kickUser(userId) {
    if (app.currentUser.role !== 'owner' && app.currentUser.role !== 'moderator') {
        showAlert("Bu işlem için yetkiniz yok.", "danger"); return;
    }
    const userToKick = app.users.find(u => u.id === userId);
    if (userToKick && confirm(`${userToKick.username} adlı kullanıcıyı atmak istediğinize emin misiniz?`)) {
        app.users = app.users.filter(u => u.id !== userId);
        updateUserList();
        updateUserCount();
        showAlert(`${userToKick.username} odadan atıldı.`, 'warning');
    }
}
function muteUser(userId) {
     if (app.currentUser.role !== 'owner' && app.currentUser.role !== 'moderator') {
        showAlert("Bu işlem için yetkiniz yok.", "danger"); return;
    }
    const userToMute = app.users.find(u => u.id === userId);
    if (userToMute) {
        showAlert(`${userToMute.username} adlı kullanıcı susturuldu (bu özellik henüz tam aktif değil).`, 'info');
    }
}
function promoteToModerator(userId) {
    if (app.currentUser.role !== 'owner') {
        showAlert("Bu işlem için yetkiniz yok (Sadece oda sahibi moderatör atayabilir).", "danger"); return;
    }
    const userToPromote = app.users.find(u => u.id === userId);
    if (userToPromote && userToPromote.role === 'user') {
        userToPromote.role = 'moderator';
        updateUserList();
        showAlert(`${userToPromote.username} moderatör yapıldı.`, 'success');
    }
}

function demoteToUser(userId) {
    if (app.currentUser.role !== 'owner') {
        showAlert("Bu işlem için yetkiniz yok.", "danger"); return;
    }
    const userToDemote = app.users.find(u => u.id === userId);
    if (userToDemote && userToDemote.role === 'moderator') {
        userToDemote.role = 'user';
        updateUserList();
        showAlert(`${userToDemote.username} rolü kullanıcı olarak değiştirildi.`, 'info');
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messageContent = input.value.trim();

    if (messageContent) {
        const newMessage = {
            id: generateId(),
            userId: app.currentUser.id,
            username: app.currentUser.username,
            content: messageContent,
            timestamp: Date.now(),
            avatar: app.currentUser.avatar
        };

        app.messages.push(newMessage);
        addMessageToChatUI(newMessage);
        input.value = '';
        input.focus();

        if (window.socket) {
            window.socket.emit('send-message', newMessage);
        }
    }
}

function addMessageToChatUI(message) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const isCurrentUser = message.userId === app.currentUser.id;

    const messageWrapper = document.createElement('div');
    messageWrapper.className = `mesaj-sarici ${isCurrentUser ? 'gonderen-mesaj' : 'diger-mesaj'}`;


    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let avatarHtml = `<img src="${message.avatar || 'https://i.imgur.com/8Km9tLL.png'}" alt="${message.username}" class="mesaj-avatar">`;
    let userInfoHtml = `<strong class="mesaj-kullanici-adi me-2">${message.username}</strong>`;

    if (isCurrentUser) {
        userInfoHtml = `<strong class="mesaj-kullanici-adi me-2">Siz</strong>`;
    }
    
    messageWrapper.innerHTML = `
        <div class="d-flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}">
            ${!isCurrentUser ? avatarHtml : ''}
            <div class="mx-2">
                <div class="mesaj-kullanici ${isCurrentUser ? 'justify-content-end' : ''}">
                    ${userInfoHtml}
                    <small class="mesaj-zamani text-muted ${isCurrentUser ? 'text-white-50' : ''}">${time}</small>
                </div>
                <div class="mesaj-icerigi">${linkify(sanitizeHTML(message.content))}</div>
            </div>
            ${isCurrentUser ? avatarHtml : ''}
        </div>
    `;
    
    container.appendChild(messageWrapper);
    container.scrollTop = container.scrollHeight;
}

function updateChatMessagesUI() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = '';
    app.messages.forEach(msg => addMessageToChatUI(msg));
}

function clearChat() {
    if (app.messages.length === 0) {
        showAlert('Sohbet zaten boş.', 'info');
        return;
    }
    if (confirm('Tüm sohbet geçmişi silinecek. Emin misiniz?')) {
        app.messages = [];
        updateChatMessagesUI();
        showAlert('Sohbet geçmişi temizlendi.', 'success');
    }
}

function populateEmojiPicker() {
    const pickerGrid = document.querySelector('#emojiSeciciKapsayici .emoji-tablosu');
    if (!pickerGrid) return;
    pickerGrid.innerHTML = '';
    app.emojis.forEach(emojiChar => {
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = emojiChar;
        emojiSpan.title = `Emoji: ${emojiChar}`;
        emojiSpan.addEventListener('click', () => {
            const chatInput = document.getElementById('chatInput');
            chatInput.value += emojiChar;
            chatInput.focus();
        });
        pickerGrid.appendChild(emojiSpan);
    });
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emojiSeciciKapsayici');
    const isDisplayed = picker.style.display === 'block';
    picker.style.display = isDisplayed ? 'none' : 'block';

    if (picker.style.display === 'block') {
        document.addEventListener('click', closeEmojiPickerOnClickOutside, { once: true });
    }
}

function closeEmojiPickerOnClickOutside(event) {
    const picker = document.getElementById('emojiSeciciKapsayici');
    const emojiBtn = document.getElementById('emojiBtn');
    if (picker && picker.style.display === 'block' && !picker.contains(event.target) && event.target !== emojiBtn && !emojiBtn.contains(event.target) ) {
        picker.style.display = 'none';
    } else if (picker && picker.style.display === 'block') {
        document.addEventListener('click', closeEmojiPickerOnClickOutside, { once: true });
    }
}

function toggleSettingsPanel() {
    console.log("toggleSettingsPanel called");
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    if (!panel || !overlay) {
        console.error("Settings panel or overlay not found!");
        return;
    }
    panel.classList.toggle('show');
    overlay.classList.toggle('show');
    console.log("Settings panel 'show' class:", panel.classList.contains('show'));

    if (panel.classList.contains('show')) {
        document.getElementById('darkModeSwitch').checked = app.isDarkMode;
        document.getElementById('monochromeSwitch').checked = app.isMonochrome;
        document.getElementById('customBgImageUrl').value = app.customBgImageUrl;
        document.querySelectorAll('.arkaplan-secenegi').forEach(option => {
            option.classList.remove('selected');
            let currentEffectiveBg = app.customBgImageUrl ? `url('${app.customBgImageUrl}')` : app.currentBgImage;
             if (app.customBgImageUrl && option.getAttribute('data-bg') === "none") {
            } else if (option.getAttribute('data-bg') === currentEffectiveBg || (currentEffectiveBg === "none" && option.getAttribute('data-bg') === "none")) {
                option.classList.add('selected');
            }
        });
    }
}

function saveSettings() {
    app.isDarkMode = document.getElementById('darkModeSwitch').checked;
    app.isMonochrome = document.getElementById('monochromeSwitch').checked;

    const selectedBgOption = document.querySelector('.arkaplan-secenegi.selected');
    const customBgUrlInput = document.getElementById('customBgImageUrl').value.trim();

    if (customBgUrlInput) {
        app.customBgImageUrl = customBgUrlInput;
        app.currentBgImage = "none";
        localStorage.setItem('customBackgroundUrl', app.customBgImageUrl);
        localStorage.removeItem('background');
        document.body.style.backgroundImage = `url('${app.customBgImageUrl}')`;
    } else if (selectedBgOption) {
        app.currentBgImage = selectedBgOption.getAttribute('data-bg');
        app.customBgImageUrl = "";
        localStorage.setItem('background', app.currentBgImage);
        localStorage.removeItem('customBackgroundUrl');
        if (app.currentBgImage === "none") {
            document.body.style.backgroundImage = "none";
        } else {
            document.body.style.backgroundImage = app.currentBgImage;
        }
    }
    document.body.style.setProperty('--arka-plan-resmi', document.body.style.backgroundImage);

    localStorage.setItem('darkMode', app.isDarkMode);
    localStorage.setItem('monochromeMode', app.isMonochrome);

    document.body.classList.toggle('dark-mode', app.isDarkMode);
    document.body.classList.toggle('monochrome-mode', app.isMonochrome);

    showAlert('Ayarlar başarıyla kaydedildi!', 'success');
    toggleSettingsPanel();
}

function showAlert(message, type = 'info', duration = 3000) {
    const alertContainer = document.createElement('div');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '2000';
    alertContainer.style.maxWidth = '300px';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${sanitizeHTML(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
    `;

    alertContainer.appendChild(alertDiv);
    document.body.appendChild(alertContainer);

    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alertDiv);
        if (bsAlert) {
            bsAlert.close();
        }
        setTimeout(() => alertContainer.remove(), 500);
    }, duration);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function linkify(text) {
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlPattern, function(url) {
        let fullUrl = url;
        if (!url.startsWith('http') && url.startsWith('www')) {
            fullUrl = 'http://' + url;
        }
        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function inviteUsers() {
    const roomId = window.location.pathname.split('/').pop() || 'default-room';
    const inviteLink = `${window.location.origin}/join/${roomId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(inviteLink).then(() => {
            showAlert('Davet linki panoya kopyalandı!', 'success');
        }).catch(err => {
            console.error('Link kopyalanamadı:', err);
            prompt('Davet linkini kopyalamak için Ctrl+C (Cmd+C) kullanın:', inviteLink);
        });
    } else {
        prompt('Davet linkini kopyalamak için Ctrl+C (Cmd+C) kullanın:', inviteLink);
    }
}

console.log("script.js başarıyla yüklendi ve çalışmaya hazır.");