import request from '@/util/request';

// 获取所有配置项
export function getConfigs() {
	return request({
		url: '/config',
		method: 'get'
	});
}

// 添加新的配置项
export function addConfig(data) {
	return request({
		url: '/config',
		method: 'post',
		data: data
	});
}

// 更新配置项
export function updateConfig(data) {
	return request({
		url: '/config',
		method: 'put',
		data: data
	});
}

// 删除配置项
export function deleteConfig(key) {
	return request({
		url: `/config/${key}`,
		method: 'delete'
	});
}