import styles from './video-playback.module.css';

type PlayerController = {
  connect(): void;
  disconnect(): void;
};

const playerControllers = new WeakMap<HTMLVideoElement, PlayerController>();
const autoplayCallbacks = new WeakMap<
  Element,
  (isIntersecting: boolean) => void
>();

const autoplayObserver =
  'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          autoplayCallbacks.get(entry.target)?.(entry.isIntersecting);
        });
      })
    : undefined;

const reducedMotionQuery = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

function revealWhenReady(video: HTMLVideoElement) {
  let timer: number | undefined;

  const reveal = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }

    video.removeEventListener('loadeddata', reveal);
    video.style.opacity = '1';
  };

  if (video.readyState >= 2) {
    reveal();

    return reveal;
  }

  video.style.opacity = '0';
  video.addEventListener('loadeddata', reveal, { once: true });

  if (video.readyState >= 2) {
    reveal();
  } else {
    timer = window.setTimeout(reveal, 1000);
  }

  return reveal;
}

function setupPlayer(video: HTMLVideoElement) {
  const parent = video.parentNode;

  if (!parent) {
    return;
  }

  const container = document.createElement('div');
  const control = document.createElement('button');

  const mediaLabel = video.dataset.label;

  let manuallyPaused = false;

  const updateControl = () => {
    const paused = video.paused || video.ended;
    const action = paused ? 'Play' : 'Pause';

    container.classList.toggle(styles.paused, paused);

    control.setAttribute(
      'aria-label',
      mediaLabel ? `${action} ${mediaLabel} video` : `${action} video`
    );
  };

  const play = () => {
    video.preload = 'auto';
    void video.play().catch(updateControl);
  };

  parent.insertBefore(container, video);

  control.classList.add(styles.control);
  control.dataset.videoPlayerControl = '';
  control.type = 'button';

  container.classList.add(styles.player);
  container.dataset.videoPlayer = '';
  container.appendChild(video);
  container.appendChild(control);

  control.addEventListener('click', () => {
    if (video.paused) {
      manuallyPaused = false;
      play();
    } else {
      manuallyPaused = true;
      video.pause();
    }
  });

  video.addEventListener('play', updateControl);
  video.addEventListener('pause', updateControl);
  video.addEventListener('ended', updateControl);

  updateControl();

  video.style.transition = 'opacity 150ms';

  const reveal = revealWhenReady(video);
  const shouldAutoPlay = video.dataset.autoPlay === 'true';
  const featureCard = video.closest('.feature-grid li');

  let isIntersecting = false;
  let isHovered = false;

  const updateAutoplay = () => {
    const canAutoPlay =
      !reducedMotionQuery.matches || (featureCard !== null && isHovered);

    if (isIntersecting && !manuallyPaused && canAutoPlay) {
      play();
    } else if (!video.paused) {
      video.pause();
    }
  };

  const handleIntersection = (nextIsIntersecting: boolean) => {
    isIntersecting = nextIsIntersecting;
    updateAutoplay();
  };

  const handlePointerEnter = () => {
    isHovered = true;
    updateAutoplay();
  };

  const handlePointerLeave = () => {
    isHovered = false;
    updateAutoplay();
  };

  const handleReducedMotionChange = () => {
    updateAutoplay();
  };

  let connected = false;

  const controller: PlayerController = {
    connect() {
      if (video.parentNode !== container) {
        const currentParent = video.parentNode;

        if (!currentParent) {
          return;
        }

        currentParent.insertBefore(container, video);
        container.insertBefore(video, control);
      }

      if (connected) {
        return;
      }

      connected = true;

      if (!shouldAutoPlay) {
        return;
      }

      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

      if (featureCard) {
        isHovered = featureCard.matches(':hover');
        featureCard.addEventListener('pointerenter', handlePointerEnter);
        featureCard.addEventListener('pointerleave', handlePointerLeave);
      }

      if (autoplayObserver) {
        autoplayCallbacks.set(container, handleIntersection);
        autoplayObserver.observe(container);
      } else {
        handleIntersection(true);
      }
    },

    disconnect() {
      if (!connected) {
        return;
      }

      connected = false;

      autoplayObserver?.unobserve(container);
      autoplayCallbacks.delete(container);
      reducedMotionQuery.removeEventListener(
        'change',
        handleReducedMotionChange
      );
      featureCard?.removeEventListener('pointerenter', handlePointerEnter);
      featureCard?.removeEventListener('pointerleave', handlePointerLeave);

      isHovered = false;

      video.pause();
      reveal();

      if (container.isConnected && !video.isConnected) {
        container.remove();
      }
    },
  };

  playerControllers.set(video, controller);
  controller.connect();
}

function initializeVideoPlayers() {
  const setup = (video: HTMLVideoElement) => {
    if (!video.hasAttribute('playsinline')) {
      return;
    }

    const controller = playerControllers.get(video);

    if (controller) {
      controller.connect();
      return;
    }

    if (visibilityObserver) {
      visibilityObserver.observe(video);
    } else {
      setupPlayer(video);
    }
  };

  const scan = (node: Node) => {
    if (!(node instanceof Element)) {
      return;
    }

    if (node instanceof HTMLVideoElement) {
      setup(node);
    }

    node.querySelectorAll<HTMLVideoElement>('video').forEach(setup);
  };

  const cleanup = (node: Node) => {
    if (!(node instanceof Element)) {
      return;
    }

    const cleanupVideo = (video: HTMLVideoElement) => {
      if (video.isConnected) {
        return;
      }

      visibilityObserver?.unobserve(video);
      playerControllers.get(video)?.disconnect();
    };

    if (node instanceof HTMLVideoElement) {
      cleanupVideo(node);
    }

    node.querySelectorAll<HTMLVideoElement>('video').forEach(cleanupVideo);
  };

  const visibilityObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                observer.unobserve(entry.target);

                if (entry.target instanceof HTMLVideoElement) {
                  setupPlayer(entry.target);
                }
              }
            });
          },
          { rootMargin: '300px' }
        )
      : undefined;

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(scan);
      mutation.removedNodes.forEach(cleanup);
    });
  });

  document.querySelectorAll<HTMLVideoElement>('video').forEach(setup);

  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

initializeVideoPlayers();

export {};
