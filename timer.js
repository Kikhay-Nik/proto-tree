export default class TimerDisplay {
  constructor(seconds) {
    if (typeof seconds !== 'number' || seconds < 1) {
      throw new TypeError('Кол-во секунд должно быть числом больше нуля');
    }

    this.startTime = seconds;
    this.currentTime = seconds;
  }

  set currentTime(time) {
    this._currentTime = time;
    if (this.displayElement) {
        this.displayElement.textContent = time;
    }
  }

  get currentTime() {
    return this._currentTime;
  }

  start() {
    this.inerval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    clearInterval(this.inerval);
  }

  reset() {
    this.pause();
    this.currentTime = this.startTime;
  }

  tick() {
    if (this.currentTime <= 1) {
      this.currentTime = 0;
      this.pause();
      return;
    }
    --this.currentTime;
  }

  getComponentElement() {
    if (this.rootElement) return this.rootElement;
    const root = document.createElement('div');
    const timerDisplay = document.createElement('div');
    const startBtn = document.createElement('button');
    const pauseBtn = document.createElement('button');
    const resetBtn = document.createElement('button');

    root.append(timerDisplay, startBtn, pauseBtn, resetBtn);
    startBtn.textContent = 'Старт';
    pauseBtn.textContent = 'Пауза';
    resetBtn.textContent = 'Сброс';

    startBtn.addEventListener('click', () => this.start());
    pauseBtn.addEventListener('click', () => this.pause());
    resetBtn.addEventListener('click', () => this.reset());

    this.rootElement = root;
    this.displayElement = timerDisplay;
    this.displayElement.textContent = this.currentTime;

    return root;
  }
}
