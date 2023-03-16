/**
 * @jest-environment jsdom
 */

import { expect, test, beforeEach, describe } from '@jest/globals';
import { Timer } from '../scripts/components/Timer';

const $ = require('jquery');


function clearDom() {
  document.body.innerHTML = '';
}

function addTimer(tabIndex = 0) {
  const timer = new Timer(document.body, tabIndex);
  const timerDom = timer.container;

  return {timer, timerDom};
}

beforeEach(() => {
  clearDom();
});

describe('Initial DOM structure', () => {
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

// describe('Interaction', () => {
//   describe('Timer start', () => {
//     test('Activates display', () => {

//     });
//   });
// });