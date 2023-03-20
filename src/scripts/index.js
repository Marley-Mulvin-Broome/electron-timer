import { TimerSettings } from './components/TimerSettings.js';
import { SplitContainer } from './components/SplitContainer.js';
import { Timer } from './components/Timer.js';


function selectTimer(timer) {
  if (selectedTimer !== null) {
    selectedTimer.select(false);
  }

  selectedTimer = timer;

  selectedTimer.select();
}

const timers = [];
let selectedTimer = null;

for (let i = 0; i < 10; i++) {
  const timer = new Timer(i);
  timer.style = 'margin-left: auto;';
  timers.push(timer);

  timers[i].onclick = () => {
    selectTimer(timers[i]);
  };

  timers[i].onfocus = () => {
    selectTimer(timers[i]);
  };

  const timerSettings = new TimerSettings(i, `Timer ${i}`);

  const splitContainer = new SplitContainer(timerSettings.container, timer.container, '30%', '70%');
  splitContainer.place(document.body);
  splitContainer.onclick = () => {
    selectTimer(timers[i]);
  };
}

selectTimer(timers[0]);


window.addEventListener('keydown', (event) => {
  if (selectedTimer !== null) {
    selectedTimer.feedKeyPress(event.key);
  }
});