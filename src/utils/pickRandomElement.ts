function pickRandomElement<T>(elements: Array<T>): T {
  const randomIndex = Math.floor(Math.random() * elements.length);

  return elements[randomIndex];
}

export default pickRandomElement;
