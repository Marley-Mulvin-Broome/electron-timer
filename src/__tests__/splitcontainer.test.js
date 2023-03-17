/**
 * @jest-environment jsdom
 */

import { expect, test, describe, afterAll } from '@jest/globals';
import { clearDom } from '../testUtil/utilFuncs';
import { SplitContainer } from '../scripts/components/SplitContainer';
// import { domHas } from '../testUtil/utilFuncs';

const $ = require('jquery');

function createSplitContainer(leftWidth, rightWidth, mockLeft = undefined, mockRight = undefined) {
  if (mockLeft === undefined)
    mockLeft = $('<p></p>').text('Mock content left!');
  if (mockRight === undefined)
    mockRight = $('<p></p>').text('Mock content right!');

  const splitContainer = new SplitContainer(mockLeft[0], mockRight[0], leftWidth, rightWidth);

  return splitContainer;
}

describe('Initial DOM structure', () => {
  afterAll(() => clearDom());

  const splitContainer = createSplitContainer('width: 20%;', 'width: 50%;');

  test('Has main container', () => {
    expect($('body').find('div.split-container')).toBeTruthy();
  });

  test('Has sub containers', () => {
    const container = splitContainer.container;
    expect($(container).find('div.split-container-sub').length).toBe(2);
  });

  // TODO: Implement to check if it has style
  // test('Has style', () => {
  //   expect(hasAttr())
  // });
});