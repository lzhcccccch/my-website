/**
 * 个人导航站 API 服务模块
 * 提供链接和分类的 CRUD 操作接口，直接调用后端API
 */

import api from './baseRequest.js'

/**
 * 获取所有链接分类
 */
export function getAllCategories() {
    return api.get('/navigationCategory/list');
}

/**
 * 获取所有网站链接
 */
export function getAllLinks() {
    return api.get('/navigationWebsite/list');
}

/**
 * 创建新分类
 */
export async function createCategory(categoryData) {
    return api.post('/navigationCategory', categoryData);
}

/**
 * 创建新链接
 */
export async function createLink(linkData) {
    return await api.post('/navigationWebsite', linkData);
}

/**
 * 更新链接
 */
export async function updateLink(id, updateData) {
    return await api.put(`/navigationWebsite/${id}`, updateData);
}

/**
 * 删除链接
 */
export async function deleteLink(id) {
    return await api.delete(`/navigationWebsite/${id}`);
}

/**
 * 更新链接排序
 */
export async function updateLinksOrder(categoryId, linkIds) {
    return await api.put(`/navigationWebsite/order`, {
        categoryId,
        linkIds
    });
}
