document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.fullscreen-video');
    
    if (video) {
        // Забавяне на видеото 5 пъти
        video.playbackRate = 0.2;
        
        video.addEventListener('play', function() {
            // Поддържаме забавената скорост дори след превъртане
            video.playbackRate = 0.2;
        });

        const playVideo = async () => {
            try {
                await video.play();
            } catch (error) {
                console.log("Auto-play was prevented:", error);
            }
        };

        playVideo();
        
        // Проверка за грешки при зареждането
        video.addEventListener('error', function(e) {
            console.error("Error loading video:", e);
        });
    }
});