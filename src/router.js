import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from './components/SearchComponent.vue';
import SearchResultsPage from './components/SearchResult.vue';

const routes = [
  { 
    path: '/', 
    component: SearchPage,
  },
  { 
    path: '/results/:query', 
    component: SearchResultsPage,
    props: true,

  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
