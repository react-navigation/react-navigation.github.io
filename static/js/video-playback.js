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

  const feature = video.closest('.feature-grid li');

  if (feature != null) {
    video.removeAttribute('loop');
    video.loop = false;

    feature.addEventListener('mouseenter', () => {
      video.removeEventListener('ended', pause);
      video.loop = true;

      play();
    });

    feature.addEventListener('mouseleave', () => {
      video.loop = false;

      video.addEventListener('ended', pause, { once: true });
    });
  } else {
    container.addEventListener('click', () => {
      if (video.paused) {
        play();
      } else {
        pause();
      }
    });
  }

  container.style.borderRadius = window.getComputedStyle(video).borderRadius;

  video.style.transition = 'opacity 150ms';

  if (video.readyState >= 2) {
    video.style.opacity = '1';
  } else {
    video.style.opacity = '0';

    video.addEventListener('loadeddata', () => {
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
