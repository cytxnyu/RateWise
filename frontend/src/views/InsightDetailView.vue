<template>
  <el-container>
    <el-main>
      <el-skeleton v-if="loading" :rows="5" animated />
      <el-alert
        v-else-if="errorMessage"
        class="article-alert"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />

      <el-card v-else-if="article" class="article-detail">
        <h1>{{ article.Title }}</h1>
        <p>{{ article.Content }}</p>
        <div>
          <el-button type="primary" :loading="likeLoading" @click="likeArticle">点赞</el-button>
          <p>点赞数: {{ likes }}</p>
        </div>
      </el-card>

      <div v-else class="no-data">请先登录/注册后阅读文章。</div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from '../axios';
import type { Article, Like } from '../types/Article';

const article = ref<Article | null>(null);
const route = useRoute();
const likes = ref<number>(0);
const loading = ref(false);
const likeLoading = ref(false);
const errorMessage = ref('');

const id = route.params.id as string;

const fetchArticle = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get<Article>(`/articles/${id}`);
    article.value = response.data;
  } catch (error) {
    console.error('Failed to load article:', error);
    errorMessage.value = '文章加载失败，请确认已登录、文章存在且后端服务正常。';
  } finally {
    loading.value = false;
  }
};

const likeArticle = async () => {
  likeLoading.value = true;

  try {
    const res = await axios.post<Like>(`/articles/${id}/like`);
    likes.value = Number(res.data.likes || 0);
    ElMessage.success('点赞成功。');
  } catch (error) {
    console.log('Error Liking article:', error);
    ElMessage.error('点赞失败，请稍后重试。');
  } finally {
    likeLoading.value = false;
  }
};

const fetchLike = async () => {
  try {
    const res = await axios.get<Like>(`/articles/${id}/like`);
    likes.value = Number(res.data.likes || 0);
  } catch (error) {
    console.log('Error fetching likes:', error);
  }
};

onMounted(fetchArticle);
onMounted(fetchLike);
</script>

<style scoped>
.article-detail {
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
