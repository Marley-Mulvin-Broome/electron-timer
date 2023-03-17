/**
 * @jest-environment jsdom
 */

import { expect, test, describe, afterAll, afterEach } from '@jest/globals';
import { Timer } from '../scripts/components/Timer';
// import { log } from 'console';

const $ = require('jquery');


function clearDom() {
  document.body.innerHTML = '';
}

function addTimer(tabIndex = 0) {
  const timer = new Timer(tabIndex);
  timer.place(document.body);
  const timerDom = timer.container;

  return {timer, timerDom};
}

// function readDisplayTime(timerDisplayJq) {
//   return timerDisplayJq.text();
// }

// function feedKeys(timerObject, keys) {
//   for (const key of keys) {
//     timerObject.feedKeyPress(key);
//   }
// }

describe('Initial DOM structure', () => {
  afterAll(() => clearDom());

  const { timerDom } = addTimer();
  const timerJq = $(timerDom);

  test('Has timer-container class', () => {
    expect(timerJq.hasClass('timer-container')).toBeTruthy();
  });

  test('Has disabled timer-display span', () => {
    expect(timerJq.has('span.timer-display.timer-hidden')).toBeTruthy();
  });

  describe('Digits', () => {
    test('Has 2 hour digits', () => {
      expect(timerJq.find('span.timer-digit.timer-h').length).toBe(2);
    });

    test('Has 2 minute digits', () => {
      expect(timerJq.find('span.timer-digit.timer-m').length).toBe(2);
    });

    test('Has 2 second digits', () => {
      expect(timerJq.find('span.timer-digit.timer-s').length).toBe(2);
    });
  });

  describe('Buttons', () => {
    test('Has buttons container', () => {
      expect(timerJq.has('div.timer-buttons-container')).toBeTruthy();
    });

    test('Has start button', () => {
      expect(timerJq.find('div.timer-buttons-container').has('button.timer-start-button.timer-button')).toBeTruthy();
    });

    test('Has reset button', () => {
      expect(timerJq.find('div.timer-buttons-container').has('button.timer-reset-button.timer-button')).toBeTruthy();
    });
  });
});

// TODO: Add more testing for this component

describe('Interaction', () => {
  afterEach(() => clearDom());

  // describe('Setting up', () => {
    
  // });

  describe('Timer start', () => {
    test('Activates display', () => {
      const { timer, timerDom } = addTimer();

      const timerJq = $(timerDom);

      timer.start();

      expect(timerJq.find('span.timer-display').hasClass('timer-hidden')).toBeFalsy();
    });

    // const displayValues = [
    //   { inputKeys: [], outputString: '0s' },
    //   { inputKeys: [ '1' ], outputString: '1s' },
    //   { inputKeys: [ '1', '0' ], outputString: '10s' },
    //   { inputKeys: [ '1', '1', '3' ], outputString: '1m13s' },
    //   { inputKeys: [ '1', '2', '1', '3' ], outputString: '12m13s' },
    //   { inputKeys: [ '1', '1', '1', '2', '1', '3' ], outputString: '11h12m13s' },
    //   { inputKeys: [ '1', '0', '0', '0', '0', '0' ], outputString: '10h0m0s' },
    //   { inputKeys: [ '1', '0', '0', '0', '0' ], outputString: '1h0m0s' },
    //   { inputKeys: [ '1', '0', '0', '0' ], outputString: '10m0s' },
    //   { inputKeys: [ '1', '0', '0' ], outputString: '10m0s' },
    //   { inputKeys: [ '1', '0', '0' ], outputString: '1m0s' },
    //   { inputKeys: [ '1', 'a', 'g', 'd', 'b', 'fasdfasedf', '0', '0' ], outputString: '1m0s' },
    // ];

    // test.each(displayValues)('Display correctly (inputKeys: $inputKeys) === ($outputString)', (({inputKeys, outputString}) => {
    //   const { timer, timerDom } = addTimer();

    //   feedKeys(timer, inputKeys);
    //   timer.start();

    //   const timerDisplayJq = $(timerDom).find('span.timer-display');

    //   const displayOutput = readDisplayTime(timerDisplayJq);

    //   log(timerDisplayJq.html());


    //   expect(displayOutput).toBe(outputString);
    // }));
  });
});