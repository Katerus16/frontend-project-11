/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import onChange from 'on-change';
import { isEmpty } from 'lodash';
import axios from 'axios';
import isValid from './validate.js';
import parser from './parser.js';
import {
  renderErrors, renderSuccess, renderErrorsParser, renderErrorsNetwork, renderModal, createPosts,
  createFeeds,
} from './renderHTML.js';

const getFeed = async (link) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', `${link}`);
  return axios.get(url);
};

const handleSubmit = (watchedState) => async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const valueUrl = formData.get('url');
  watchedState.errors = await isValid(valueUrl, watchedState.form.data.link);
  if (isEmpty(watchedState.errors)) {
    watchedState.form.state = 'valid';
    watchedState.form.data.link.push(valueUrl);
    e.target.reset();
  } else {
    watchedState.form.state = 'invalid';
  }
  try {
    const parseAndPush = async () => {
      const getTestFeed = await getFeed(valueUrl);
      const { feed: newFeed, posts } = parser(getTestFeed.data.contents);
      const newPosts = posts.filter(
        (newPost) => !watchedState.posts.find((post) => post.title === newPost.title),
      );
      watchedState.posts.push(...newPosts);
      if (!watchedState.feeds.find((feed) => newFeed.title === feed.title)) {
        watchedState.feeds.push(newFeed);
      }
      setTimeout(parseAndPush, 5000);
    };
    await parseAndPush();
  } catch (err) {
    watchedState.form.data.link = watchedState.form.data.link.slice(0, -1);
    if (err.message === 'Network Error') {
      watchedState.errorMessage = 'Network Error';
    } else {
      watchedState.errorMessage = 'Parser Error';
    }
  }
};

const handleClick = (watchedState) => (e) => {
  const { id } = e.target.dataset;
  watchedState.shownPosts.push(id);
  watchedState.currentPost = id;
};

export default async (runApp) => {
  await runApp();
  const state = {
    form: {
      state: '',
      data: {
        link: [],
      },
    },
    errors: [],
    feeds: [],
    posts: [],
    shownPosts: [],
    currentPost: null,
    errorMessage: '',
  };
  const watchedState1 = onChange(state, async (path, value, previousValue) => {
    if (path.startsWith('currentPost')) {
      const { link, title, description } = state.posts.find((post) => post.id === value);
      renderModal(link, title, description);
    }
    if (path.startsWith('form.state')) {
      if (value === 'valid') {
        renderSuccess();
      }
    }
    if (path.startsWith('shownPosts')) {
      const a = document.querySelector(`a[data-id="${value[value.length - 1]}"]`);
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal');
    }
    if (path.startsWith('errors') && !isEmpty(value)) {
      renderErrors(value);
    }
    if (path.startsWith('errorMessage')) {
      if (value === 'Network Error') {
        renderErrorsNetwork();
      } else {
        renderErrorsParser();
      }
    }
    if (path.startsWith('posts')) {
      const newPosts = value.filter((post) => !previousValue.includes(post));
      createPosts(newPosts, handleClick(watchedState1));
    }
    if (path.startsWith('feeds')) {
      const newFeeds = value.filter((feed) => !previousValue.includes(feed));
      createFeeds(...newFeeds);
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit(watchedState1));
};
