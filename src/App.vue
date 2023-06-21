
<template>
  <div id="app">
    <router-view />
    
  </div>
</template>

<script>
/* eslint-disable */
import SearchPage from './components/SearchComponent.vue'
import SearchResults from './components/SearchResult.vue'

export default {
  name: 'App',
  components: {
    SearchPage,
    SearchResults
  },
  computed: {
    searchCompleted() {
      return this.$store.state.searchResults.length > 0;
    }
  }
}
</script>
