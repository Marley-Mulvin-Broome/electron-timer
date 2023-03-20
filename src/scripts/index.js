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
  const timer = new Timer(i, i % 2 === 0);
  timer.style = 'margin-left: auto;';
  timers.push(timer);

  timers[i].onclick = () => {
    selectTimer(timers[i]);
  };

  timers[i].onfocus = () => {
    selectTimer(timers[i]);
  };

  const leftContent = document.createElement('p');
  leftContent.innerText = 'Hello there!';

  const splitContainer = new SplitContainer(leftContent, timer.container, '20%', '50%');
  splitContainer.place(document.body);
}

selectTimer(timers[0]);


window.addEventListener('keydown', (event) => {
  if (selectedTimer !== null) {
    selectedTimer.feedKeyPress(event.key);
  }
});