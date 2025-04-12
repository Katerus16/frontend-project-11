import { uniqueId } from 'lodash';

export default (xmlString) => {
  // eslint-disable-next-line no-undef
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(xmlString.replaceAll('\n', '').replaceAll('  ', ''), 'application/xml');
  if (!doc1.querySelector('rss')) {
    throw new Error();
  }
  const feed = { id: uniqueId() };
  const title = doc1.querySelector('title');
  const description = doc1.querySelector('description');
  feed.title = title.textContent.trim();
  feed.description = description.textContent.trim();
  const items = doc1.querySelectorAll('item');
  const posts = [...items]
    .map((item) => {
      const titleItem = item.querySelector('title');
      const descriptionItem = item.querySelector('description');
      const linkItem = item.querySelector('link');
      const post = { id: uniqueId(), feedId: feed.id };
      post.link = linkItem.textContent.trim();
      post.title = titleItem.textContent.trim();
      post.description = descriptionItem.textContent.trim();
      return post;
    });
  return { feed, posts };
};
