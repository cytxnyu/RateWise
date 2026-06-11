<template>
  <el-container>
    <el-form v-loading="loading" :model="form" class="exchange-form">
      <el-alert
        v-if="errorMessage"
        class="exchange-alert"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />

      <el-form-item label="从货币" label-width="80px">
        <el-select v-model="form.fromCurrency" placeholder="选择货币">
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
        </el-select>
      </el-form-item>

      <el-form-item label="到货币" label-width="80px">
        <el-select v-model="form.toCurrency" placeholder="选择货币">
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
        </el-select>
      </el-form-item>

      <el-form-item label="金额" label-width="80px">
        <el-input v-model.number="form.amount" type="number" min="0" placeholder="输入金额" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="exchange">兑换</el-button>
      </el-form-item>

      <el-empty
        v-if="!loading && !errorMessage && rates.length === 0"
        description="暂无汇率数据，请先登录后通过接口添加汇率。"
      />
    </el-form>

    <div v-if="result" class="result">
      <p>兑换结果: {{ result }}</p>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '../axios';

interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

const form = ref({
  fromCurrency: '',
  toCurrency: '',
  amount: 0,
});

const result = ref('');
const loading = ref(false);
const errorMessage = ref('');
const currencies = ref<string[]>([]);
const rates = ref<ExchangeRate[]>([]);

const fetchCurrencies = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get<ExchangeRate[]>('/exchangeRates');
    rates.value = response.data || [];
    currencies.value = [...new Set(rates.value.map((rate) => [rate.fromCurrency, rate.toCurrency]).flat())];
  } catch (error) {
    console.log('Failed to load currencies', error);
    errorMessage.value = '汇率数据加载失败，请确认后端服务、MySQL 和 Redis 已正常启动。';
  } finally {
    loading.value = false;
  }
};

const exchange = () => {
  if (!form.value.fromCurrency || !form.value.toCurrency) {
    ElMessage.warning('请选择要兑换的货币。');
    return;
  }

  if (!form.value.amount || Number(form.value.amount) <= 0) {
    ElMessage.warning('请输入大于 0 的金额。');
    return;
  }

  const rate = rates.value.find(
    (item) => item.fromCurrency === form.value.fromCurrency && item.toCurrency === form.value.toCurrency
  )?.rate;

  if (rate !== undefined) {
    const converted = Number(form.value.amount) * rate;
    result.value = `${form.value.amount} ${form.value.fromCurrency} = ${converted.toFixed(4)} ${form.value.toCurrency}`;
  } else {
    result.value = '';
    ElMessage.warning('没有找到对应汇率，请选择其他货币组合。');
  }
};

onMounted(fetchCurrencies);
</script>

<style scoped>
.exchange-form {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.exchange-alert {
  margin-bottom: 16px;
}

.result {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
  font-size: 18px;
}
</style>
