/**
 * 个人导航站 API 服务模块
 */
import api from './baseRequest.js'

// 分类相关API
/**
 * 获取所有分类
 */
export function getAllCategories() {
    return api.get('/navigationCategory/list');
}

/**
 * 创建新分类
 */
export function createCategory(categoryData) {
    return api.post('/navigationCategory/save', categoryData);
}

// 网站相关API
/**
 * 获取所有网站链接
 */
export function getAllLinks() {
    return api.get('/navigationWebsite/list');
}

/**
 * 获取分类及其下的网站列表
 */
export function getCategoriesWithWebsites() {
    return api.get('/navigationWebsite/listByCategory');
}

/**
 * 创建新链接
 */
export function createLink(linkData) {
    return api.post('/navigationWebsite/save', linkData);
}

/**
 * 更新链接
 */
export function updateLink(updateData) {
    return api.put('/navigationWebsite/update', updateData);
}

/**
 * 删除链接
 */
export function deleteLink(id) {
    return api.delete(`/navigationWebsite/${id}`);
}
