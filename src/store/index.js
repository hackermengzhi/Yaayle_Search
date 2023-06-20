import { createStore } from 'vuex';

export default createStore({
    state: {
        searchTerm: "",
        searchResults: [], // 将初始值从 null 改为 []
      },
      mutations: {
        setSearchTerm(state, searchTerm) {
          state.searchTerm = searchTerm;
        },
        setSearchResults(state, searchResults) {
          state.searchResults = searchResults;
        },
      },
});
