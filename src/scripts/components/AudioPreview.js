import { getFileName } from '../logic/utility.js';

 

export class AudioPreview {
  parent;

  // progressBgColour = '#45c5f9';
  progressBgColour = '#ffb2ff';
  selectedBgColour = 'var(--dark-style-highlight)';
  defaultBgColour = 'var(--dark-style-bg)';

  #container;
  #audioElement;
  #audioFilePath;
  #audioName;

  #playPauseButton;
  #stopButton;
  #buttonsContainer;

  #progressInterval;

  #selected = false;

  constructor (audioFile) {
    this.#container = document.createElement('div');
    this.#container.classList.add('audio-preview');

    this.#audioName = document.createElement('p');
    this.#audioName.innerText = getFileName(audioFile);
    this.#audioFilePath = audioFile;
    this.#audioElement = new Audio(audioFile);
    this.#audioElement.loop = false;
    this.#audioElement.volume = 0.5;

    this.#buttonsContainer = document.createElement('div');
    this.#buttonsContainer.classList.add('audio-preview-buttons-container');

    this.#playPauseButton = document.createElement('button');
    this.#playPauseButton.classList.add('audio-preview-button');
    this.#playPauseButton.innerHTML = 'P';
    this.#playPauseButton.onclick = () => {
      if (this.playing) {
        this.pause();
      } else {
        this.play();
      }
    };

    this.#stopButton = document.createElement('button');
    this.#stopButton.classList.add('audio-preview-button');
    this.#stopButton.innerHTML = 'S';
    this.#stopButton.onclick = () => {
      this.stop();
    }; 

    this.#container.appendChild(this.#audioName);
    this.#buttonsContainer.appendChild(this.#playPauseButton);
    this.#buttonsContainer.appendChild(this.#stopButton);
    this.#container.appendChild(this.#buttonsContainer);

    this.#audioName.onclick = () => {
      if (this.parent) {
        this.parent.selectAudioPreview(this);
        return;
      }

      this.toggleSelect();
    };
  }

  select() {
    this.#container.classList.add('audio-preview-selected');

    this.#selected = true;
  }

  deselect() {
    this.#container.classList.remove('audio-preview-selected');

    this.#selected = false;
  }

  toggleSelect() {
    if (this.#selected) {
      this.deselect();
    } else {
      this.select();
    }
  }

  play() {
    this.#audioElement.play();

    this.#progressInterval = setInterval(() => {
      if (!this.playing) {
        return;
      }

      this.updateProgress();
    }, 10);
  }

  pause() {
    this.#audioElement.pause();
  }

  stop() {
    this.#audioElement.pause();
    this.#audioElement.currentTime = 0;

    clearInterval(this.#progressInterval);
    this.#container.style.background = '';
  }

  updateProgress() {
    if (this.#audioElement.currentTime === this.#audioElement.duration) {
      this.stop();
    }

    this.#container.style.background = `linear-gradient(to right, ${this.progressBgColour} ${this.progress}%, ${this.currentBgColour} ${this.progress}%)`;
  }

  remove() {
    this.parent.removeAudioFile(this);
  }

  get currentBgColour() {
    return this.selected ? this.selectedBgColour : this.defaultBgColour;
  }

  get selected() {
    return this.#selected;
  }

  get container() {
    return this.#container;
  }

  get progress() {
    return (this.#audioElement.currentTime / this.#audioElement.duration) * 100;
  }

  get playing() {
    return !this.#audioElement.paused;
  }
}