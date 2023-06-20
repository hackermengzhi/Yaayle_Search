<template>
  <div>
    <SearchResultsPage :query="searchTerm" />
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
        <input
          type="text"
          v-model="searchTerm"
          @keyup.enter="navigateToResults(searchTerm)"
          placeholder="Search Yaayle or type a URL"
        />
      </div>
      <div class="buttons">
        <button @click="navigateToResults(searchTerm)">Yaayle 搜索</button>
      </div>
    </div>
    <div class="results-container">
      <div class="results-summary">
        <p>
          yaayle为您找到相关结果约 <span>{{ searchResultsCount }}</span> 个
        </p>
      </div>
      <p class="may">
        你可能想找：
        <span v-for="(word, index) in expand_word" :key="index">
          <router-link
            :to="{ path: '/', query: { search: word } }"
            @click.native="navigateToResults(word)"
          >
            {{ word }}
          </router-link>
          {{ index < expand_word.length - 1 ? ", " : "" }}
        </span>
      </p>
      <div class="result" v-for="(result, index) in message" :key="index">
        <h2 class="result-title" v-html="result.title"></h2>
        <p class="result-desc" v-html="result.desc"></p>
        <p class="result-source" v-html="result.source"></p>
        <p
          class="result-content"
          v-html="highlightSearchTerm(result.content)"
        ></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchResultsPage from "./SearchResult.vue";
export default {
  components: {
    SearchResultsPage,
  },
  props: ["query"],
  data() {
    return {
      searchT: "",
      error: {
        show: false,
        message: "",
      },
    };
  },
  computed: {
    searchTerm: {
      get() {
        // 返回 searchTerm 的值
        return this.$store.state.searchTerm;
      },
      set(value) {
        // 修改 searchTerm 的值
        this.$store.commit("setSearchTerm", value);
      },
    },
    searchResults() {
      return this.$store.state.searchResults;
    },

    correct() {
      return this.searchResults ? this.searchResults.correct : "";
    },
    expand_word() {
      return this.searchResults ? this.searchResults.expand_word : [];
    },
    message() {
      return this.searchResults ? this.searchResults.message : [];
    },
    searchResultsCount() {
      if (this.searchResults && this.searchResults.message) {
        return this.searchResults.message.length;
      }
      return 0;
    },
  },
  methods: {
    async performSearch() {
      if (!this.searchTerm) {
        this.$router.push({ path: "/" });
        return;
      }
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
        await this.$store.commit("setSearchResults", response.data);
        this.$router.push({ path: "/results/" + this.searchTerm });
      } catch (error) {
        this.error.message = "An error occurred: " + error.message;
        this.error.show = true;
        setTimeout(() => {
          this.error.show = false;
        }, 3000);
      }
    },
    async navigateToResults(query) {
      this.searchTerm = query;
      await this.$nextTick(); // Wait for all reactive changes to be applied
      await this.performSearch(); // Perform the search
    },
    highlightSearchTerm(content) {
      const searchTerm = this.searchTerm.toLowerCase();
      const cleanedContent = content.map((sentence) => {
        const regex = /<strong\b[^<]*>(.*?)<\/strong>/gi;
        return sentence.replace(regex, "$1");
      });
      return cleanedContent
        .map((sentence) => {
          const regex = new RegExp(searchTerm, "gi");
          return sentence.replace(regex, (match) => `<mark>${match}</mark>`);
        })
        .join(" ");
    },
  },
  mounted() {
    if (this.query) {
      this.searchTerm = this.query;
      this.performSearch();
    }
  },
};
</script>

<style scoped>
mark {
  background-color: yellow;
  font-weight: bold;
}
.search-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  height: 9vh;
  text-align: center;
  padding: 0 20px;
}

.search-title {
  margin-bottom: 20px;
  font-family: "Product Sans", Arial, sans-serif;
  font-size: 2em;
  pointer-events: none;
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
  width: 600px;
  height: 66px;
  padding: 0 20px;
  margin-bottom: 20px;
  margin-left: 30px;
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
  justify-content: top;
  width: 300px;

  margin-left: 10px;
}

.buttons button {
  height: 70px;
  font-size: 18px;
  width: 150px;
  border-radius: 8px;
  border: 2px solid #dadddf;
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

.results-container {
  padding: 20px;
}

.search-title {
  font-size: 24px;
  color: #202124;
  margin-bottom: 20px;
}

.results-list {
  display: grid;
  grid-gap: 20px;
}

.result {
  border: 1px solid #dfe1e5;
  border-radius: 4px;
  padding: 20px;
}

.result-title {
  font-size: 24px;
  color: #4285f4;
  margin-bottom: 20px;
  font-weight: bold;
}

.result-desc {
  font-size: 14px;
  color: #5f6368;
  margin-bottom: 10px;
}

.result-source {
  font-size: 12px;
  color: #9aa0a6;
  margin-bottom: 5px;
}

.result-content {
  font-size: 14px;
  color: #202124;
}
.results-summary {
  margin-bottom: 20px;
  color: #5f6368;
}
.results-summary p {
  font-size: 14px;
}
.results-summary span {
  font-weight: bold;
}
</style>
