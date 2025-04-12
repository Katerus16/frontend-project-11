import * as yup from 'yup';
import i18next from 'i18next';

yup.setLocale({
  mixed: {
    default: 'error',
  },
  string: {
    url: () => ({ key: 'invalidUrl' }),
  },
  array: {
    unique: () => ({ key: 'notUniqueUrl' }),
  },
});

yup.addMethod(yup.array, 'unique', function unique() {
  return this.test('unique', { key: 'notUniqueUrl' }, (list) => list.length === new Set(list).size);
});

const schema = yup.array().of(yup.string().url()).unique();

const isValid = async (value, links) => {
  try { await schema.validate([...links, value]); } catch (err) {
    const messages = err.errors.map((error) => i18next.t(error.key));
    return messages;
  }
  return [];
};
export default isValid;
