<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.author" class="author-line">
    <span class="author-name">作者：{{ frontmatter.author }}</span>
    <span v-if="frontmatter.created"> · 创建于 {{ frontmatter.created }}</span>
    <span v-if="frontmatter.updated"> · 更新于 {{ frontmatter.updated }}</span>
  </div>
</template>

<style scoped>
.author-line {
  font-size: 13px;
  color: var(--vp-c-text-2);
  padding: 2px 0 10px;
  border-bottom: 1px dashed var(--vp-c-divider);
  margin-bottom: 18px;
}
.author-name {
  font-weight: 600;
}
</style>
