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
  timers.push(new Timer(document.body));

  timers[i].onclick = () => {
    selectTimer(timers[i]);
  }

  const element = document.createElement("button");
  element.innerText = "Toggle";
  element.onclick = () => {
    timers[i].toggle();
  }

  document.body.appendChild(element);
}

selectTimer(timers[0]);


window.addEventListener("keydown", (event) => {
  if (selectedTimer !== null) {
    selectedTimer.feedKeyPress(event.key);
  }

  if (event.key === "DownArrow") {
  }
});