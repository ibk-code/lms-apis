function useJoinString(params) {
  function getIntials(first, last) {
    return `${first[0]}.${last[0]}`;
  }

  return {
    getIntials,
  };
}
