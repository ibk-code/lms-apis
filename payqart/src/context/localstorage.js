const storage = localStorage;

export const loadState = () => {
  try {
    const userState = storage.getItem("appState");
    if (userState === null) {
      return {};
    }

    return JSON.parse(userState);
  } catch (error) {
    return {};
  }
};

export const setLocalState = (state) => {
  try {
    const serializedState = JSON.stringify(state);

    return storage.setItem("appState", serializedState);
  } catch (error) {}
};
