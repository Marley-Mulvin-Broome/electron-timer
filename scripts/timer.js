TIME_SECOND = 's';
TIME_MINUTE = 'm';
TIME_HOUR   = 'h';

STARTING_INDEX = 7;

function createTimerSpan(isValue, timeUnit) {
  const span = document.createElement("span");

  if (isValue) {
    span.classList.add("timer-digit");
    span.innerText = '0';
  } else {
    span.classList.add("timer-unit");
    span.innerText = timeUnit;
  }

  span.classList.add(`timer-${timeUnit}`);

  return span;
}

function setupTimer(container) {
  const spans = [];

  for (let i = 0; i < 9; i++) {
    const isValue = (i + 1) % 3 !== 0;

    let timeUnit = TIME_SECOND;

    if (i < 3) {
      timeUnit = TIME_HOUR;
    } else if (i < 6) {
      timeUnit = TIME_MINUTE;
    }

    spans.push(
      createTimerSpan(isValue, timeUnit)
    );
  }

  spans.forEach(
    (span) => {
      container.appendChild(span);
    }
  );

  return spans;
}

function selectTimeSlot(previousSpan, newSpan) {
  if (Object.is(previousSpan, newSpan))
    return;

  if (previousSpan !== null) {
    previousSpan.classList.remove("timer-active");
  }

  newSpan.classList.add("timer-active");
}

function checkIndex(index, wasPositiveIncrement) {
  // need to keep it in bounds first
  // not > 8 because 8 is not selectable

  if (index < 0) {
    return 0;
  } else if (index > 7) {
    return 7;
  }

  // need to check edge-case for going onto 'h' or 'm' spans
  if (index === 2 || index === 5) {
    if (wasPositiveIncrement) {
      return index + 1;
    } 

    return index - 1;
  }

  return index;
}

const currentTimerValue = () => {
  return timerValues[selectedIndex];
}

const timerContainer = document.getElementsByClassName("timer-container")[0];

const timerValues = setupTimer(timerContainer);

let selectedIndex = STARTING_INDEX;

selectTimeSlot(null, currentTimerValue());


window.addEventListener("keydown", (event) => {  
  const previousSpan = timerValues[selectedIndex];

  if (event.key === "ArrowLeft") {
    selectedIndex = checkIndex(selectedIndex - 1, false);
  } else if (event.key === "ArrowRight") {
    selectedIndex = checkIndex(selectedIndex + 1, true);
  }

  selectTimeSlot(previousSpan, timerValues[selectedIndex]);
});