export default function calculate(code, args = null) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function('args', `return ${code}`)(args);
  } catch (e) {
    return e;
  }
}
