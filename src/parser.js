import { uniqueId } from 'lodash';

export default (xmlString) => {
  // eslint-disable-next-line no-undef
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(xmlString.replaceAll('\n', '').replaceAll('  ', ''), 'application/xml');
  if (doc1.documentElement.nodeName !== 'rss') {
    throw new Error();
  }
  const feed = { id: uniqueId() };
  const nodes = doc1.documentElement.firstChild.childNodes;
  [...nodes]
    .filter((node) => ['title', 'description'].includes(node.nodeName))
    .forEach((node) => { feed[node.nodeName] = node.textContent.trim(); });
  const parseItem = (item) => {
    const itemNodes = item.childNodes;
    const dataItem = { id: uniqueId(), feedId: feed.id };
    [...itemNodes]
      .filter((node) => ['title', 'link', 'description'].includes(node.nodeName))
      .forEach((node) => { dataItem[node.nodeName] = node.textContent.trim(); });
    return dataItem;
  };
  const posts = [...nodes].filter((node) => (node.nodeName) === 'item').map(parseItem);
  return { feed, posts };
};
