<template>
  <div id="app">
    <SearchPage @search-completed="updateSearchResults" :class="{ 'has-results': hasResults }" />
    <SearchResultsPage :searchResults="searchResults" />
  </div>
</template>

<script>
import SearchPage from './components/SearchComponent.vue';
import SearchResultsPage from './components/SearchResult.vue';

export default {
  name: 'App',
  components: {
    SearchPage,
    SearchResultsPage,
  },
  data() {
  return {
    searchResults: null,
    hasResults: false,  // 新增的属性
  };
},

  methods: {
    updateSearchResults(results) {
      this.searchResults = results;
      this.hasResults = !!results;
    },
  },
};
</script>
