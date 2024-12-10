export default {
  name: 'RequestUtil',
  axiosInstance: null,
  install(axiosInstance) {
    this.axiosInstance = axiosInstance
    window.$$get = async function(url, params) {
      return (await axiosInstance.get(url, { params })).data
    }
    window.$$post = async function(url, data) {
      return (await axiosInstance.post(url, data || {})).data
    }
  },
  async $$get(url, params) {
    return (await this.axiosInstance.get(url, { params })).data
  },
  async $$post(url, data) {
    return (await this.axiosInstance.post(url, data || {})).data
  },
  async $page(entityName, params) {
    return await $$get(`/commonData/selectPage/${entityName}`, params)
  },
  async $list(entityName, params) {
    return await $$get(`/commonData/selectList/${entityName}`, params)
  },
  async $one(entityName, id) {
    return await $$get(`/commonData/selectOne/${entityName}`, { id })
  },
  async $insert(entityName, data) {
    await $$post(`/common/insert/${entityName}`, data)
  },
  async $saveOrUpdate(entityName, data) {
    await $$post(`/common/insertOrUpdate/${entityName}`, data)
  },
  async $updateById(entityName, data) {
    await $$post(`/common/update/${entityName}`, data)
  },
  async $deleteById(entityName, id) {
    await $$post(`/common/delete/${entityName}/${id}`)
  },
  appendParams(url, params) {
    if (!url.includes('?')) {
      url += '?'
    }
    return url + Object.keys(params)
      .map(key => params[key] && `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
  },
  async simpleGet(url, header = '/api', dataFun = (o) => o.data) {
    try {
      const response = await fetch(header + url)
      const data = await response.json()
      return dataFun(data)
    } catch (error) {
      console.error('Error in simpleGet:', error)
      throw error // Rethrow the error for handling by the caller
    }
  }
}
// export default new ObjectUtil()
