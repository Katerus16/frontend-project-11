import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().url(),
});

const isValid = async (value, validState) => {
  const valid = await schema.isValid({ name: value });
  if (!valid) {
    return { error: 'Ссылка должна быть валидным URL' };
  }
  if (validState.form.data.link.includes(value)) {
    return { error: 'RSS уже существует' };
  }
  return { error: '' };
};
export default isValid;
