function fadeInOnLoad(video) {
  if (video.readyState >= 3) {
    video.style.transition = 'opacity 1s';
    video.style.opacity = '1';
  } else {
    video.style.transition = 'opacity 1s';
    video.style.opacity = '0';

    video.addEventListener('canplaythrough', () => {
      video.style.opacity = '1';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => {
    const videos = document.querySelectorAll('video');

    videos.forEach((video) => {
      if (video.dataset.seen) {
        return;
      }

      video.dataset.seen = true;

      if (video.hasAttribute('playsinline')) {
        video.addEventListener('click', () => {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
      }

      fadeInOnLoad(video);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
});
