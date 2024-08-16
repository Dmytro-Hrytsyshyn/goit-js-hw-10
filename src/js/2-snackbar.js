import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.form');
  
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const delay = parseInt(form.delay.value, 10);
        const state = form.state.value;
  
        createPromise(delay, state)
          .then(message => iziToast.success({ title: 'Success', message }))
          .catch(error => iziToast.error({ title: 'Error', message: error }));
      });
    }
  
    function createPromise(delay, state) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (state === 'fulfilled') {
            resolve(` ✅ Fulfilled promise in ${delay}ms`);
          } else {
            reject(`❌ Rejected promise in ${delay}ms`);
          }
        }, delay);
      });
    }
  });