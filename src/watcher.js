import onChange from 'on-change';
import { isEmpty } from 'lodash';
import axios from 'axios';
import isValid from './validate.js';
import parser from './parser.js';
import {
  create, renderErrors, renderSuccess, renderErrorsParser, renderErrorsNetwork,
} from './renderHTML.js';

const handleSubmit = (watchedState) => async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const valueUrl = formData.get('url');
  watchedState.errors = await isValid(valueUrl, watchedState);
  if (isEmpty(watchedState.errors)) {
    watchedState.form.state = 'valid';
    watchedState.form.data.link.push(valueUrl);
    e.target.reset();
  } else {
    watchedState.form.state = 'invalid';
  }
};

const handleClick = (watchedState) => (e) => {
  const h5 = document.querySelector('#modal h5');
  const { id } = e.target.dataset;
  const { link, title, description } = watchedState.posts.find((post) => post.id === id);
  h5.textContent = title;
  const divBody = document.querySelector('.modal-body');
  divBody.textContent = description;
  const a = document.querySelector('#modal a');
  a.setAttribute('href', link);
  watchedState.shownPosts.push(id);
};

const getFeed = async (link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`);

export default async (runApp) => {
  await runApp();
  const state = {
    form: {
      state: 'valid',
      data: {
        link: [],
      },
    },
    errors: [],
    feeds: [],
    posts: [],
    shownPosts: [],
  };
  const watchedState1 = onChange(state, async (path, value) => {
    if(path.startsWith('shownPosts')) {
      const a = document.querySelector(`a[data-id="${value[value.length - 1]}"]`);
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal');
    }
    if (path.startsWith('errors') && !isEmpty(value)) {
      renderErrors(value);
    }
    if (path.startsWith('form.data.link')) {
      try {
        const parseAndCreate = async () => {
          const getTestFeed = await getFeed(value[value.length - 1]);
          const { feed: newFeed, posts } = parser(getTestFeed.data.contents);
          console.log(newFeed);
          const newPosts = posts.filter(
            (newPost) => !state.posts.find((post) => post.title === newPost.title),
          );
          state.posts.push(...newPosts);
          if (!state.feeds.find((feed) => newFeed.title === feed.title)) {
            state.feeds.push(newFeed);
            create(newFeed, newPosts, handleClick(watchedState1));
          } else {
            create(null, newPosts, handleClick(watchedState1));
          }
          setTimeout(parseAndCreate, 5000);
        };
        parseAndCreate();
        renderSuccess();
      } catch (err) {
        state.form.data.link = state.form.data.link.slice(0, -1);
        if (err.message === 'Network Error') {
          renderErrorsNetwork();
        } else {
          renderErrorsParser();
        }
      }
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit(watchedState1));
};
