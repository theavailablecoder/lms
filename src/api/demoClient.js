const delay = (value, milliseconds = 120) => new Promise((resolve) => {
  window.setTimeout(() => resolve(structuredClone(value)), milliseconds);
});

export const demoClient = {
  get: (value) => delay(value),
  mutate: (value) => delay(value, 80),
};
