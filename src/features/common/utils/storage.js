const getItem = key => {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  } else {
    return value;
  }
}

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return;
}

const removeItem = key => {
  localStorage.removeItem(key);
  return;
}

const clearStorage = () => {
  localStorage.clear();
  return;
}

export default {
  getItem,
  setItem,
  removeItem,
  clearStorage
}