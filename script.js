document.addEventListener('DOMContentLoaded', () => {
  const dot = document.getElementById('dot');
  const startStop = document.getElementById('startStop');
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  const closeMenu = document.getElementById('closeMenu');
  const speedRange = document.getElementById('speedRange');
  const speedLabel = document.getElementById('speedLabel');
  const heartbeatAudio = document.getElementById('heartbeat');

  let running = false;
  let direction = 1; // 1 -> right, -1 -> left
  let speedBPM = parseInt(speedRange.value, 10);
  let pos = 0; // 0 to 1 representing percentage across screen
  let lastTimestamp = null;
  let beatTimer = null;

  const updateSpeedLabel = () => speedLabel.textContent = speedBPM;

  updateSpeedLabel();

  const startBeats = () => {
    if (beatTimer) clearInterval(beatTimer);
    const interval = 60000 / speedBPM; // ms per beat
    beatTimer = setInterval(() => {
      // Play from start each beat
      heartbeatAudio.currentTime = 0;
      heartbeatAudio.play();
    }, interval);
  };

  const stopBeats = () => {
    if (beatTimer) {
      clearInterval(beatTimer);
      beatTimer = null;
    }
    heartbeatAudio.pause();
    heartbeatAudio.currentTime = 0;
  };

  const start = () => {
    running = true;
    startStop.textContent = 'Stop';
    lastTimestamp = null;
    startBeats();
    requestAnimationFrame(step);
  };

  const stop = () => {
    running = false;
    startStop.textContent = 'Start';
    stopBeats();
  };

  startStop.addEventListener('click', () => running ? stop() : start());

  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  closeMenu.addEventListener('click', () => {
    menu.classList.add('hidden');
  });

  speedRange.addEventListener('input', () => {
    speedBPM = parseInt(speedRange.value, 10);
    updateSpeedLabel();
    if (running) startBeats();
  });

  // Convert BPM to cycle time (left-right-left = 2 beats)
  const step = (timestamp) => {
    if (!running) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 1000; // seconds
    lastTimestamp = timestamp;

    const bps = speedBPM / 60;
    const cycleTime = 2 / bps; // seconds for a full cycle
    const distancePerSecond = 2 / cycleTime; // pos units per second

    pos += direction * distancePerSecond * dt;

    if (pos >= 1) {
      pos = 1;
      direction = -1;
    } else if (pos <= 0) {
      pos = 0;
      direction = 1;
    }

    const viewportWidth = window.innerWidth;
    const x = pos * (viewportWidth - 40) + 20;
    dot.style.transform = `translate(${x}px, -50%)`;

    requestAnimationFrame(step);
  };

  window.addEventListener('resize', () => {
    const viewportWidth = window.innerWidth;
    const x = pos * (viewportWidth - 40) + 20;
    dot.style.transform = `translate(${x}px, -50%)`;
  });
});
