<template>
  <div class="search-container">
    <h1 class="search-title">
      <span class="y">Y</span>
      <span class="a1">a</span>
      <span class="a2">a</span>
      <span class="y">y</span>
      <span class="l">l</span>
      <span class="e">e</span>
    </h1>
    <div class="search-box">
      <text>🔍</text>
      <input type="text" v-model="searchTerm" @keyup.enter="performSearch" placeholder="Search Yaayle or type a URL" />
    </div>
    <div class="buttons">
      <button @click="performSearch">Yaayle 搜索</button>
      <button>手气不错</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchTerm: "",
      searchResults: [],
      error: {
        show: false,
        message: "",
      },
    };
  },
  methods: {
    async performSearch() {
     
      const requestBody = {
        query: this.searchTerm,
        tag: "expand",
        size: "20",
      };

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/search",
          requestBody
        );
        await this.$store.commit("setSearchTerm", this.searchTerm);
        
        await this.$store.commit('setSearchResults', response.data);
        
        this.$router.push({ path: '/results/' + this.searchTerm })

      } catch (error) {
        this.error.message = "An error occurred: " + error.message;
        this.error.show = true;
        setTimeout(() => {
          this.error.show = false;
        }, 3000);
      }
    },
    async luckySearch() {
      // Implement the "I'm feeling lucky" functionality here
    },
  },
};
</script>

<style scoped>
.search-container.has-results {
  display: flex;
  flex-direction: column;
  align-items: flex-start;  
  padding: 0 20px;
  
}
* {
  user-select: none;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
}

.search-title {
  margin-bottom: 20px;
  font-family: "Product Sans", Arial, sans-serif;
  font-size: 8em;
}

.y {
  color: #4285f4;
}

.a1 {
  color: #db4437;
}

.a2 {
  color: #f4b400;
}

.l {
  color: #0f9d58;
}

.e {
  color: #4285f4;
}

.search-box {
  display: flex;
  align-items: center;
  width: 800px;
  height: 66px;
  padding: 0 20px;
  margin-bottom: 20px;
  border: 1px solid #dfe1e5;
  box-shadow: none;
  border-radius: 24px;
  transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box:hover {
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
}

.search-box input,
.search-box button {
  pointer-events: auto;
}

.search-title,
.search-results,
.search-result,
.result-title,
.result-description {
  pointer-events: none;
}

.search-box input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-box input::placeholder {
  color: #9aa0a6;
}


.buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  width: 300px;
  height: 100px;
}

.buttons button {
  font-size: 18px;
  padding: 10px 20px;
  margin: 11px 4px;
  border-radius: 4px;
  border: 1px solid #f8f9fa;
  color: #3c4043;
  background-color: #f8f9fa;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.buttons button:hover {
  border: 1px solid #dadce0;
  color: #202124;
  background-color: #f8f9fa;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}



/* Media queries for different screen sizes */
@media (max-width: 600px) {
  .search-title {
    font-size: 3em;
  }

  .search-box input {
    font-size: 16px;
  }

  .button-container button {
    font-size: 16px;
  }
}
</style>
