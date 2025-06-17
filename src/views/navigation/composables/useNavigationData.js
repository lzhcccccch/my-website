/**
 * 导航数据管理 Composable
 * 负责数据获取、状态管理和基础数据操作
 */
import { ref, computed } from 'vue'
import { getCategoriesWithWebsites } from '../../../api/navigation.js'

export function useNavigationData() {
  // 数据状态
  const categories = ref([])
  const websiteList = ref([])
  const isLoading = ref(false)

  // 搜索和筛选状态
  const searchQuery = ref('')
  const selectedCategory = ref('all')

  /**
   * 加载分类和网站数据
   */
  async function loadCategoriesWithWebsites() {
    try {
      isLoading.value = true
      const data = await getCategoriesWithWebsites()
      
      // 构建分类列表，添加"全部"选项
      categories.value = [
        { id: 'all', categoryName: '全部', categorySort: 0 },
        ...data
      ]

      // 扁平化所有网站数据
      const allLinks = []
      if (Array.isArray(data)) {
        data.forEach(category => {
          if (category?.websiteList && category.websiteList.length > 0) {
            allLinks.push(...category.websiteList)
          }
        })
      }
      websiteList.value = allLinks
    } catch (error) {
      throw new Error(error.message || '加载数据失败')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 过滤后的分类列表
   */
  const filteredCategories = computed(() => {
    // 获取所有真实分类并排序
    let filtered = categories.value
      .filter(cat => cat?.id !== 'all')
      .sort((a, b) => (a?.categorySort || 0) - (b?.categorySort || 0))

    // 根据选中分类筛选
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(cat => String(cat?.id) === String(selectedCategory.value))
    }

    // 为每个分类关联对应的链接
    filtered = filtered.map(category => {
      const categoryLinks = websiteList.value
        .filter(link => String(link?.categoryId) === String(category?.id))
        .sort((a, b) => (a?.siteSort || 0) - (b?.siteSort || 0))

      return {
        ...category,
        links: categoryLinks
      }
    })

    // 根据搜索关键词过滤
    if ((searchQuery.value || '').trim()) {
      const query = (searchQuery.value || '').toLowerCase()
      filtered = filtered.map(category => ({
        ...category,
        links: category.links.filter(link =>
          link?.siteName.toLowerCase().includes(query) ||
          link?.siteOverview.toLowerCase().includes(query) ||
          getDomain(link?.siteUrl).toLowerCase().includes(query)
        )
      })).filter(category => category.links && category.links.length > 0)
    }

    return filtered
  })

  /**
   * 从URL中提取域名
   */
  function getDomain(url) {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return {
    // 状态
    categories,
    websiteList,
    isLoading,
    searchQuery,
    selectedCategory,
    
    // 计算属性
    filteredCategories,
    
    // 方法
    loadCategoriesWithWebsites,
    getDomain
  }
}
