import onChange from 'on-change';
import { isEmpty } from 'lodash';
import isValid from './validate.js';

const handleSubmit = (watchedState) => async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const valueUrl = formData.get('url');
  watchedState.errors = await isValid(valueUrl, watchedState);
  if (isEmpty(watchedState.errors.error)) {
    watchedState.form.state = 'valid';
    watchedState.form.data.link.push(valueUrl);
    e.target.reset();
  } else {
    watchedState.form.state = 'invalid';
  }
};

const createFeedbackElement = () => {
  const elem = document.createElement('p');
  elem.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  document.querySelector('form').parentNode.appendChild(elem);
  return elem;
}

const renderErrors = (errors) => {
  const elem = document.querySelector('p.feedback') === null ? createFeedbackElement() : document.querySelector('p.feedback');
  elem.classList.add('text-danger');
  elem.textContent = errors.error;
};

const renderSuccess = () => {
  const elem = document.querySelector('p.feedback') === null ? createFeedbackElement() : document.querySelector('p.feedback');
  elem.classList.remove('text-danger');
  elem.textContent = 'RSS успешно добавлен';
};

export default () => {
  const state = {
    form: {
      state: 'valid',
      data: {
        link: [],
      },
    },
    errors: {},
  };

  const watchedState1 = onChange(state, (path, value) => {
    if (path.startsWith('errors') && !isEmpty(value)) {
      renderErrors(value);
    }
    if (path.startsWith('form.data.link')) {
      renderSuccess();
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit(watchedState1));
};
