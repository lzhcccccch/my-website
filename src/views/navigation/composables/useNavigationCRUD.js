/**
 * 导航 CRUD 操作 Composable
 * 负责分类和链接的增删改查操作
 */
import { createCategory, createLink, updateLink, deleteLink } from '../../../api/navigation.js'

export function useNavigationCRUD(navigationData, notification) {
  const { websiteList, isLoading, loadCategoriesWithWebsites } = navigationData
  const { showNotification } = notification

  /**
   * 添加新分类
   */
  async function addCategory(categoryData) {
    try {
      isLoading.value = true
      const newCat = await createCategory(categoryData)
      await loadCategoriesWithWebsites()
      showNotification(`分类 "${newCat.categoryName || categoryData.categoryName}" 添加成功！`, 'success')
      return newCat
    } catch (error) {
      showNotification(error.message || '添加分类失败', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 删除分类
   */
  async function deleteCategory(categoryId) {
    if (!confirm('确定要删除这个分类吗？分类下的所有链接也会被删除。')) {
      return
    }

    try {
      isLoading.value = true
      // TODO: 调用删除分类的API（需要后端实现）
      await loadCategoriesWithWebsites()
      showNotification('分类删除成功！', 'success')
    } catch (error) {
      showNotification(error.message || '删除分类失败', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 添加新链接
   */
  async function addLink(linkData) {
    try {
      isLoading.value = true

      // 如果没有提供 siteSort，则计算默认排序位置
      let finalLinkData = { ...linkData }
      if (!finalLinkData.siteSort) {
        const categoryLinks = websiteList.value.filter(
          link => String(link?.categoryId) === String(linkData.categoryId)
        )
        const maxSiteSort = categoryLinks.length > 0
          ? Math.max(...categoryLinks.map(link => link?.siteSort || 0))
          : 0
        finalLinkData.siteSort = maxSiteSort + 1
      }

      const newLinkData = await createLink(finalLinkData)
      await loadCategoriesWithWebsites()
      showNotification(`链接 "${newLinkData.siteName || linkData.siteName}" 添加成功！`, 'success')
      return newLinkData
    } catch (error) {
      showNotification(error.message || '添加链接失败', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新链接
   */
  async function updateLinkData(linkData) {
    try {
      isLoading.value = true
      await updateLink({...linkData})

      await loadCategoriesWithWebsites()
      showNotification(`链接 "${linkData.siteName}" 更新成功！`, 'success')
    } catch (error) {
      showNotification(error.message || '更新链接失败', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 删除链接
   */
  async function deleteLinkById(linkId) {
    if (!confirm('确定要删除这个链接吗？')) {
      return
    }

    try {
      isLoading.value = true
      const linkToDelete = websiteList.value.find(
        link => String(link?.id) === String(linkId)
      )
      await deleteLink(linkId)
      await loadCategoriesWithWebsites()
      showNotification(`链接 "${linkToDelete?.siteName || ''}" 删除成功！`, 'success')
    } catch (error) {
      showNotification(error.message || '删除链接失败', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    addCategory,
    deleteCategory,
    addLink,
    updateLinkData,
    deleteLinkById
  }
}
