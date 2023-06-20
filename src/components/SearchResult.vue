<template>
    <div class="results-container">
      <h1>{{ correct }}</h1>
      <p>你可能想找：{{ expand_word.join(', ') }}</p>
      <div class="result" v-for="(result, index) in message" :key="index">
        <h2 v-html="result.title[0]"></h2>
        <p v-html="result.desc[0]"></p>
        <p v-html="result.source[0]"></p>
        <p v-html="result.content.join(' ')"></p>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    props: {
      searchResults: Object,
    },
    computed: {
      correct() {
        return this.searchResults ? this.searchResults.correct : '';
      },
      expand_word() {
        return this.searchResults ? this.searchResults.expand_word : [];
      },
      message() {
        return this.searchResults ? this.searchResults.message : [];
      },
    },
  };
  </script>
  <style scoped>
  .results-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .results-container h1 {
    font-size: 24px;
    color: #202124;
    margin-bottom: 20px;
  }
  
  .results-container p {
    font-size: 14px;
    color: #5f6368;
    margin-bottom: 20px;
  }
  
  .result {
    border: 1px solid #dfe1e5;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .result h2 {
    font-size: 18px;
    color: #202124;
    margin-bottom: 10px;
  }
  
  .result p {
    font-size: 14px;
    color: #5f6368;
    margin-bottom: 10px;
  }
  
  .result p:last-child {
    margin-bottom: 0;
  }
  </style>
  