function setupPlayer(video) {
  const container = document.createElement('div');
  const icon = document.createElement('div');

  video.parentNode.insertBefore(container, video);

  icon.classList.add('video-player-icon');

  container.classList.add('video-player');
  container.appendChild(video);
  container.appendChild(icon);

  container.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      container.classList.remove('paused');
    } else {
      video.pause();
      container.classList.add('paused');
    }
  });

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
        setupPlayer(video);
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
});
