/* eslint-disable no-undef */
import i18next from 'i18next';

export const createFeedbackElement = () => {
  const elem = document.createElement('p');
  elem.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  document.querySelector('form').parentNode.appendChild(elem);
  return elem;
};

export const renderErrors = (errors) => {
  const elem = document.querySelector('p.feedback') === null ? createFeedbackElement() : document.querySelector('p.feedback');
  elem.classList.add('text-danger');
  elem.textContent = errors.join();
};
export const renderErrorsParser = () => {
  const elem = document.querySelector('p.feedback') === null ? createFeedbackElement() : document.querySelector('p.feedback');
  elem.classList.add('text-danger');
  elem.textContent = i18next.t('errorParser');
};
export const renderErrorsNetwork = () => {
  const elem = document.querySelector('p.feedback') === null ? createFeedbackElement() : document.querySelector('p.feedback');
  elem.classList.add('text-danger');
  elem.textContent = i18next.t('errorNetwork');
};

export const renderSuccess = () => {
  const elem = document.querySelector('p.feedback') === null ? createFeedbackElement() : document.querySelector('p.feedback');
  elem.classList.remove('text-danger');
  elem.textContent = i18next.t('successUrl');
};

const renderHTML = () => {
  const divPosts = document.querySelector('div.posts');
  const divFeeds = document.querySelector('div.feeds');
  const divCardFeeds = document.createElement('div');
  divCardFeeds.classList.add('card', 'border-0');
  divFeeds.appendChild(divCardFeeds);
  const divCardBodyFeeds = document.createElement('div');
  divCardBodyFeeds.classList.add('card-body');
  divCardFeeds.appendChild(divCardBodyFeeds);
  const h2Feeds = document.createElement('h2');
  h2Feeds.classList.add('card-title', 'h4');
  divCardBodyFeeds.appendChild(h2Feeds);
  h2Feeds.textContent = i18next.t('feeds');
  const divCardPosts = document.createElement('div');
  divCardPosts.classList.add('card', 'border-0');
  divPosts.appendChild(divCardPosts);
  const divCardBodyPosts = document.createElement('div');
  divCardBodyPosts.classList.add('card-body');
  divCardPosts.appendChild(divCardBodyPosts);
  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
  divCardPosts.appendChild(ulPosts);
  const h2Posts = document.createElement('h2');
  h2Posts.classList.add('card-title', 'h4');
  divCardBodyPosts.appendChild(h2Posts);
  h2Posts.textContent = i18next.t('posts');
  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  divCardFeeds.appendChild(ulFeeds);
};

export const createFeeds = (feed) => {
  if (!document.querySelector('div.feeds ul')) {
    renderHTML();
  } else {
    const liFeeds = document.createElement('li');
    liFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
    const ulFeeds = document.querySelector('div.feeds ul');
    ulFeeds.appendChild(liFeeds);
    const h3Feeds = document.createElement('h3');
    h3Feeds.classList.add('h6', 'm-0');
    h3Feeds.textContent = feed.title;
    liFeeds.appendChild(h3Feeds);
    const pFeeds = document.createElement('p');
    pFeeds.classList.add('m-0', 'small', 'text-black-50');
    pFeeds.textContent = feed.description;
    liFeeds.appendChild(pFeeds);
  }
};
export const createPosts = (posts, handleClick) => {
  if (!document.querySelector('div.posts ul')) {
    renderHTML();
  }
  posts.forEach((post) => {
    const liPosts = document.createElement('li');
    liPosts.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const ulPosts = document.querySelector('div.posts ul');
    ulPosts.appendChild(liPosts);
    const aPosts = document.createElement('a');
    aPosts.classList.add('fw-bold');
    aPosts.setAttribute('target', '_blank');
    aPosts.setAttribute('href', post.link);
    aPosts.setAttribute('rel', 'noopener noreferrer');
    aPosts.textContent = post.title;
    aPosts.dataset.id = post.id;
    liPosts.appendChild(aPosts);
    const buttonPosts = document.createElement('button');
    buttonPosts.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPosts.dataset.id = post.id;
    buttonPosts.setAttribute('type', 'button');
    buttonPosts.textContent = 'Просмотр';
    buttonPosts.addEventListener('click', handleClick);
    buttonPosts.dataset.bsToggle = 'modal';
    buttonPosts.dataset.bsTarget = '#modal';
    liPosts.appendChild(buttonPosts);
  });
};

export const renderModal = (link, title, description) => {
  const h5 = document.querySelector('#modal h5');
  h5.textContent = title;
  const divBody = document.querySelector('.modal-body');
  divBody.textContent = description;
  const a = document.querySelector('#modal a');
  a.setAttribute('href', link);
};
