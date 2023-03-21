import { Modal } from './Modal.js';
import { AudioPreview } from './AudioPreview.js'; 

export class AudioMenu extends Modal {
  #audioMenuHeader;
  #audioMenuBody;
  #audioMenuAddAudioButton;
  #audioMenuFooter;
  #audioMenuCloseButton;

  #audioPreviews = [];

  #currentTargetTimer;

  #previousAudioPreview;

  constructor() {
    super(true);

    this.#audioMenuHeader = document.createElement('div');
    this.#audioMenuHeader.classList.add('audio-menu-header');

    const h2 = document.createElement('h2');
    h2.innerText = 'Audio Menu';

    this.#audioMenuHeader.appendChild(h2);

    this.#audioMenuBody = document.createElement('div');
    this.#audioMenuBody.classList.add('audio-menu-body');

    this.#audioMenuAddAudioButton = document.createElement('button');
    this.#audioMenuAddAudioButton.classList.add('audio-menu-add-audio-button');
    this.#audioMenuAddAudioButton.innerHTML = '+';
    this.#audioMenuAddAudioButton.onclick = () => {
      this.addAudioPrompt();
    };

    this.#audioMenuBody.appendChild(this.#audioMenuAddAudioButton);

    this.#audioMenuFooter = document.createElement('div');
    this.#audioMenuFooter.classList.add('audio-menu-footer');

    

    this.#audioMenuCloseButton = document.createElement('button');
    this.#audioMenuCloseButton.classList.add('audio-menu-close-button');
    this.#audioMenuCloseButton.innerHTML = 'Close';
    this.#audioMenuCloseButton.onclick = () => {
      this.close();
    };

    this.#audioMenuFooter.appendChild(this.#audioMenuCloseButton);
    this.addContent(this.#audioMenuHeader);
    this.addContent(this.#audioMenuBody);
    this.addContent(this.#audioMenuFooter);
  }

  addAudioPrompt() {
  }

  addAudioFile(audioFile) {
    const audioPreview = new AudioPreview(audioFile);
    this.#audioPreviews.push(audioPreview);

    audioPreview.parent = this;

    this.#audioMenuAddAudioButton.before(audioPreview.container);

  }
  
  removeAudioFile(audioPreview) {
    const index = this.#audioPreviews.indexOf(audioPreview);
    if (index > -1) {
      this.#audioPreviews.splice(index, 1);
    }
    this.#audioMenuBody.removeChild(audioPreview.container);
  }

  setTarget(targetTimer) {
    this.#currentTargetTimer = targetTimer;
  }

  selectAudioPreview(audioPreview) {
    if (this.#previousAudioPreview) {
      this.#previousAudioPreview.deselect();
    }

    audioPreview.select();
    this.#previousAudioPreview = audioPreview;
  }

  open() {
    super.open();
    if (this.#audioPreviews.length > 0) {
      this.selectAudioPreview(this.#audioPreviews[0]);
    }
  }

  close() {
    super.close();
    this.#audioPreviews.forEach(audioPreview => {
      audioPreview.stop();
    });
  }
}