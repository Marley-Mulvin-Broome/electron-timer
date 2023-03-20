import { Modal } from './components/Modal.js';
import { SplitContainer } from './components/SplitContainer.js';
import { Timer } from './components/Timer.js';

const modalContent = document.createElement('div');

for (let i = 0; i < 50; i++) {
  const p = document.createElement('p');
  p.innerText = 'Hello there!' + i;

  modalContent.appendChild(p);
}

const modalTest = new Modal(modalContent);

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

  const leftContent = document.createElement('button');
  leftContent.onclick = () => {
    modalTest.open();
  };
  leftContent.innerText = 'Hello there!';

  const splitContainer = new SplitContainer(leftContent, timer.container, '20%', '50%');
  splitContainer.place(document.body);
}

selectTimer(timers[0]);


window.addEventListener('keydown', (event) => {
  if (selectedTimer !== null) {
    selectedTimer.feedKeyPress(event.key);
  }

  modalTest.feedKeyPress(event.key);
});