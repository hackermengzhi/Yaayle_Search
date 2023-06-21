<template>
  <div>
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
      <div class="advanced-search">
        <div class="dropdown" @click="toggleAdvancedSearch">
          <!-- 倒三角图标 -->
          <text>高级搜索</text>
          <i class="fa fa-caret-down"></i>
        </div>
        <!-- 高级搜索条件 -->
        <div class="advanced-search-options" v-if="expandSearch">
          <!-- 单选框 -->
          <label>
            <input type="radio" v-model="expandSearchOption" value="expand" />
            扩展搜索
          </label>
          <label>
            <input type="radio" v-model="expandSearchOption" value="false" />
            普通搜索
          </label>

          <!-- 搜索条数框 -->
          <label class="inputbox">
            搜索条数：
            <input type="number" v-model="searchLimit" />
          </label>
        </div>
      </div>
    </div>

    <div class="results-container">
      <div class="results-summary">
        <p>
          yaayle为您找到相关结果约 <span>{{ searchResultsCount }}</span> 个
        </p>
      </div>
      <p
        class="may"
        v-if="expandSearchOption === 'expand' && expand_word.length > 0"
      >
        你可能想找：
        <span v-for="(word, index) in expand_word" :key="index">
          <router-link
            :to="{ path: '/', query: { search: word } }"
            @click="navigateToResults(word)"
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
/* eslint-disable */
import axios from "axios";
import SearchResultsPage from "./SearchResult.vue";
export default {
  components: {
    SearchResultsPage,
  },
  props: ["query"],
  data() {
    return {
      expandSearch: false, // 是否展开高级搜索
      expandSearchOption: "false", // 扩展搜索选项，根据数据中的对应元素进行绑定
      searchLimit: 20, // 搜索条数限制，默认为10，根据数据中的对应元素进行绑定
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
    toggleAdvancedSearch() {
      this.expandSearch = !this.expandSearch;
    },
    async performSearch() {
      if (!this.searchTerm) {
        this.$router.push({ path: "/" });
        return;
      }
      const expandSearchOption = this.expandSearchOption;
      const searchLimit = this.searchLimit;
      const requestBody = {
        query: this.searchTerm,
        tag: expandSearchOption,
        size: searchLimit,
      };

      try {
        const response = await axios.post(
          "http://10.161.10.129:9500/api/search",
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
      if (content) {
        const searchTerms = this.searchTerm.toLowerCase().split(/[\s,]+/); // 将搜索词拆分为多个关键词
        const cleanedContent = content.map((sentence) => {
          const regex = /<strong\b[^<]*>(.*?)<\/strong>/gi;
          return sentence.replace(regex, "$1");
        });
        return cleanedContent
          .map((sentence) => {
            let highlightedSentence = sentence;
            searchTerms.forEach((term) => {
              const regex = new RegExp(term, "gi");
              highlightedSentence = highlightedSentence.replace(
                regex,
                (match) => `<mark>${match}</mark>`
              );
            });
            return highlightedSentence;
          })
          .join(" ");
      }
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
.advanced-search {
  position: relative;
  display: inline-block;
  margin-right: 20px;
  width: 100px;
}

.dropdown {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.dropdown i {
  font-size: 16px;
}

.advanced-search-options {
  position: absolute;
  top: 100%;
  left: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 200px;
}

.radio-label {
  display: block;
  margin-bottom: 8px;
}
.inputbox {
  display: flex;
  align-items: center;
}

.inputbox input {
  margin-left: 8px;
  width: 100px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
