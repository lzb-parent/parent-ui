import CollUtil from '../../js/utils/CollUtil'
import RequestUtil from '../../js/utils/RequestUtil'
import {initSocket} from './socket/index'

export const loginConfig = {
    // 登录路径
    // loginUrl: '/commonLogin/login',
    // 更多登录信息加载
    loginInfoMoreLoader: ()=>{},
    // 路由过滤
    authRouteFilter: (routes)=> routes,
    routeFilter: '/commonLogin/login',
}

export async function init(store) {
    // 初始化vuex
    const appName = process.env.VUE_APP_APPLICATION
    // 查询字典
    const authDictList = await RequestUtil.simpleGet(`/commonData/selectList/authDict`)
    const authDictMap = CollUtil.listToMap(authDictList, 'code', 'value')
    const tokenKey = (authDictMap['SYSTEM_VERSION'] || '') + '-' + appName.toUpperCase()
    store.set('authDictMap', authDictMap)
    store.set('siteTitle', authDictMap['SITE_NAME'])
    store.set('currency', authDictMap['SYSTEM_COUNTRY_CURRENCY_SYMBOL'])
    store.set('fileServer', authDictMap['FILE_UPLOAD_DOMAIN'])
    const countrys = await RequestUtil.simpleGet('/commonData/selectList/country')
    const countryStr = Cookies.get('country')
    store.set('countryList', countrys)
    store.set('country', countryStr ? JSON.parse(countryStr) : countrys[0])
    store.set('tokenKey', tokenKey)
    store.set('token', Cookies.get(tokenKey))
    return authDictMap
}

// 登录
export async function login(store, data, router, Layout, loginUrl) {
    const tokenKey = store.get('tokenKey')
    const accessToken = await RequestUtil.$$post(loginUrl || '/commonLogin/login', data)
    Cookies.set(tokenKey, accessToken)
    store.set('token', accessToken)
    await loadLoginData(store, router, Layout)
}

export async function logout(store, router, path = '') {
    await RequestUtil.$$post('/commonLogin/logout', {token: store.get('token')})
    Cookies.set(store.get('tokenKey'), null)
    store.set('token', '')
    // store.dispatch('tagsView/delAllViews', null, { root: true })
    path && router.push(path)
}

// 加载登录信息
export async function loadLoginData(store, router, Layout) {
    store.set('loginInfo', await $$get('/commonLogin/getLoginInfo'))
    await loginConfig.loginInfoMoreLoader()
    if (Layout) {
        // 路由菜单
        // 叶子节点编号
        const leafCodes = await $$get('/commonLogin/getAuthRouteCodes')
        // 所有节点
        let authRoutesAll = await $$get('/commonData/selectList/authRoute', {enabled: true})
        authRoutesAll = loginConfig.authRouteFilter(authRoutesAll)
        // 叶子节点
        const authRoutesLeaf = authRoutesAll.filter(o => leafCodes.includes(o.code))
        // 叶子节点 + 上层所有节点 的编号
        const leafAndParentCodes = [...leafCodes, ...authRoutesLeaf.map(menu => menu.pcode)]
        const authRouteAndParent = authRoutesAll.filter(o => leafAndParentCodes.includes(o.code)).filter(o => o.type === 'CATALOG' || o.type === 'MENU')
        store.set('authRouteList', authRouteAndParent)
        const menuTree = CollUtil.listToTree(authRoutesAll, o => o.code, o => o.pcode, 'children', authRouteAndParent.map(o => o.code))

        // 菜单树
        store.set('menuTree', menuTree)

        // 按钮权限
        let permissions = authRoutesLeaf.flatMap(m => initPermissionPath(m.permissionPaths));
        store.set('permissions', permissions)
        // console.log('permissions', JSON.stringify(permissions))

        // vue-router 动态路由
        if (authRouteAndParent) {
            const routes =
                [{
                    path: '/',
                    component: Layout,
                    children: authRouteAndParent.filter(o => o.componentPath).map(o => {
                        return {
                            path: o.componentPath,
                            component: () => import(`@/views${o.componentPath}`),
                            meta: {title: o.name}
                        }
                    })
                }]
            // 添加路由
            router.addRoutes(routes)
        }
    }
    // 订阅websocket
    await initSocket(store)
}

const pathSelectPage = '/commonData/selectPage/'
const pathSelectCountSum = '/commonData/selectCountSum/'
const pathSelectList = '/commonData/selectList/'
const pathSelectLists = '/commonData/selectLists/'
const pathSelectOne = '/commonData/selectOne/'
const pathSelectById = '/commonData/selectById/'
const pathInsertOrUpdate = '/commonData/insertOrUpdate/'
const pathInsert = '/commonData/insert/'
const pathUpdate = '/commonData/update/'
const pathDelete = '/commonData/delete/'
const pathExport = '/commonData/export/'
const pathsQuery = [
    pathSelectPage,
    pathSelectCountSum,
    pathSelectList,
    pathSelectLists,
    pathSelectOne,
    pathSelectById]
const pathsAll = [
    pathSelectPage,
    pathSelectCountSum,
    pathSelectList,
    pathSelectLists,
    pathSelectOne,
    pathSelectById,
    pathInsertOrUpdate,
    pathInsert,
    pathUpdate,
    pathDelete,
    pathExport,
]
const ALL = '#ALL#'

function initPermissionPath(permissionPaths) {
    // debugger
    return permissionPaths.split(',').filter(p => p).flatMap(permissionPath => {
        // 全部权限
        if (permissionPath.startsWith(ALL)) {
            const entityName = permissionPath.substring(ALL.length)
            return pathsAll.map(prefix => prefix + entityName)
        }
        // 单接口权限
        else if (permissionPath.startsWith('/')) {
            return [permissionPath]
        }
        // 查询权限
        else {
            const entityName = permissionPath
            return pathsQuery.map(prefix => prefix + entityName)
        }
    })
}
