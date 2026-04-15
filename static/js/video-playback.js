function setupPlayer(video) {
  const container = document.createElement('div');
  const icon = document.createElement('div');

  const play = () => {
    const promise = video.play();

    container.classList.remove('paused');

    promise?.catch(() => {
      container.classList.add('paused');
    });
  };

  const pause = () => {
    video.pause();
    container.classList.add('paused');
  };

  video.parentNode.insertBefore(container, video);

  icon.classList.add('video-player-icon');

  container.classList.add('video-player');
  container.appendChild(video);
  container.appendChild(icon);

  container.addEventListener('click', () => {
    if (video.paused) {
      play();
    } else {
      pause();
    }
  });

  container.style.borderRadius = window.getComputedStyle(video).borderRadius;

  video.style.transition = 'opacity 150ms';

  const show = () => {
    video.style.opacity = '1';
  };

  if (video.readyState >= 2) {
    show();
  } else {
    video.style.opacity = '0';

    video.addEventListener('loadeddata', show);
    video.addEventListener('canplay', show);
    video.addEventListener('canplaythrough', show);

    if (video.readyState >= 2) {
      show();
    }

    setTimeout(show, 1000);
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
