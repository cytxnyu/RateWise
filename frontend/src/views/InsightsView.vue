<template>
  <el-container>
    <el-main>
      <el-alert
        v-if="errorMessage"
        class="article-alert"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />
      <el-skeleton v-if="loading" :rows="4" animated />
      <div v-else-if="articles.length">
        <el-card v-for="article in articles" :key="article.ID" class="article-card">
          <h2>{{ article.Title }}</h2>
          <p>{{ article.Preview }}</p>
          <el-button text @click="viewDetail(article.ID)">阅读更多</el-button>
        </el-card>
      </div>
      <div v-else class="no-data">
        {{ authStore.isAuthenticated ? '暂无文章，请通过接口发布文章后查看。' : '请先登录/注册后查看文章。' }}
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from '../axios';
import { useAuthStore } from '../store/auth';
import type { Article } from "../types/Article";

const articles = ref<Article[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const fetchArticles = async () => {
  if (!authStore.isAuthenticated) {
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get<Article[]>('/articles');
    articles.value = response.data || [];
  } catch (error) {
    console.error('Failed to load articles:', error);
    errorMessage.value = '文章加载失败，请确认后端服务和登录状态是否正常。';
  } finally {
    loading.value = false;
  }
};

const viewDetail = (id: number) => {
  if (!authStore.isAuthenticated) {
    ElMessage.error('请先登录后再查看');
    return;
  }
  router.push({ name: 'InsightDetail', params: { id } });
};

onMounted(fetchArticles);
</script>

<style scoped>
.article-card {
  margin: 20px 0;
}

.article-alert {
  margin-bottom: 16px;
}

.no-data {
  text-align: center;
  font-size: 1.2em;
  color: #999;
}
</style>
