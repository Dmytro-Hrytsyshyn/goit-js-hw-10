import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


class CountdownTimer {
  constructor({ selector, targetDate }) {
    this.selector = selector;
    this.targetDate = targetDate;
    this.intervalId = null;
    this.refs = this.getRefs();
    this.init();
  }

  getRefs() {
    const container = document.querySelector(this.selector);
    return {
      datetimePicker: container.querySelector('#datetime-picker'),
      startBtn: container.querySelector('[data-start]'),
      daysEl: container.querySelector('[data-days]'),
      hoursEl: container.querySelector('[data-hours]'),
      minutesEl: container.querySelector('[data-minutes]'),
      secondsEl: container.querySelector('[data-seconds]'),
    };
  }

  init() {
    this.refs.startBtn.disabled = true;
    this.initFlatpickr();
    this.refs.startBtn.addEventListener('click', () => this.startTimer());
  }

  initFlatpickr() {
    flatpickr(this.refs.datetimePicker, {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: (selectedDates) => this.handleDateSelection(selectedDates),
    });
  }

  handleDateSelection(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      this.refs.startBtn.disabled = true;
    } else {
      this.targetDate = selectedDate;
      this.refs.startBtn.disabled = false;
    }
  }

  startTimer() {
    this.refs.startBtn.disabled = true;
    this.refs.datetimePicker.disabled = true;

    this.intervalId = setInterval(() => {
      const timeRemaining = this.targetDate - new Date();
      if (timeRemaining <= 0) {
        clearInterval(this.intervalId);
        this.updateTimer(0);
        this.refs.datetimePicker.disabled = false;
        return;
      }
      this.updateTimer(timeRemaining);
    }, 1000);
  }

  updateTimer(ms) {
    const { days, hours, minutes, seconds } = this.convertMs(ms);
    this.refs.daysEl.textContent = this.addLeadingZero(days);
    this.refs.hoursEl.textContent = this.addLeadingZero(hours);
    this.refs.minutesEl.textContent = this.addLeadingZero(minutes);
    this.refs.secondsEl.textContent = this.addLeadingZero(seconds);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new CountdownTimer({
  selector: 'body',
  targetDate: null, 
});
