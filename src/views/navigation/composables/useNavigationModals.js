/**
 * 导航弹窗管理 Composable
 * 负责弹窗状态管理和事件处理
 */
import { ref } from 'vue'

export function useNavigationModals(crudOperations) {
  const { addCategory, addLink, updateLinkData, deleteCategory, deleteLinkById } = crudOperations

  // 弹窗状态
  const showCategoryModal = ref(false)
  const showLinkModal = ref(false)
  const editingCategory = ref(null)
  const editingLink = ref(null)
  const defaultCategoryId = ref(null)

  // 分类相关事件处理
  function handleEditCategory(category) {
    editingCategory.value = category
    showCategoryModal.value = true
  }

  function handleDeleteCategory(categoryId) {
    deleteCategory(categoryId)
  }

  function handleCloseCategoryModal() {
    showCategoryModal.value = false
    editingCategory.value = null
  }

  async function handleCategorySubmit(categoryData) {
    try {
      if (editingCategory.value) {
        // TODO: 实现编辑分类功能
        console.log('编辑分类功能待实现')
      } else {
        await addCategory(categoryData)
      }
      handleCloseCategoryModal()
    } catch (error) {
      // 错误已在 CRUD 操作中处理
    }
  }

  // 链接相关事件处理
  function handleEditLink(link) {
    editingLink.value = link
    showLinkModal.value = true
  }

  function handleDeleteLink(linkId) {
    deleteLinkById(linkId)
  }

  function handleAddLink(categoryId) {
    defaultCategoryId.value = categoryId
    editingLink.value = null
    showLinkModal.value = true
  }

  function handleCloseLinkModal() {
    showLinkModal.value = false
    editingLink.value = null
    defaultCategoryId.value = null
  }

  async function handleLinkSubmit(linkData) {
    try {
      if (editingLink.value) {
        await updateLinkData(linkData)
      } else {
        await addLink(linkData)
      }
      handleCloseLinkModal()
    } catch (error) {
      // 错误已在 CRUD 操作中处理
    }
  }

  return {
    // 状态
    showCategoryModal,
    showLinkModal,
    editingCategory,
    editingLink,
    defaultCategoryId,

    // 分类事件处理
    handleEditCategory,
    handleDeleteCategory,
    handleCloseCategoryModal,
    handleCategorySubmit,

    // 链接事件处理
    handleEditLink,
    handleDeleteLink,
    handleAddLink,
    handleCloseLinkModal,
    handleLinkSubmit
  }
}
