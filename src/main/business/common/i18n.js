// i18n.js
// import Vue from 'vue';
// import VueI18n from 'vue-i18n';
// const path = require('path')

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: langBase, // 默认语言
    fallbackLocale: langBase,
    silentTranslationWarn: true,
})

const sysElementLangMap = {
    'en-US': 'en'
}
const langBase = 'en-US'
// 动态加载语言文件的函数
// 设置语言文件
async function setLocaleMessages(locale) {
    let messages = {}
    let messagesEnglish = {}
    let messagesVant = {}
    let messagesVantEnglish = {}
    let messagesParent = {}
    let messagesParentEnglish = {}
    let messagesElement = {}
    let messagesElementEnglish = {}

    try {
        messagesEnglish = (await import(`@/lang/langs/${langBase}.js`)).default
        messages = langBase === locale ? {} : (await import(`@/lang/langs/${locale}.js`)).default
    } catch (e) {
        console.warn('root ', e)
    }
    try {
        if (window.vant) {
            messagesVantEnglish = (await import(`@/lang/vant/${langBase}.ts`)).default
            messagesVant = langBase === locale ? {} : (await import(`@/lang/vant/${locale}.ts`)).default
        }
    } catch (e) {
        console.warn('vant ', e)
    }
    try {
        messagesParentEnglish = (await import(`@/parent-ui/src/main/langs/${langBase}.js`)).default
        messagesParent = langBase === locale ? {} : (await import(`@/parent-ui/src/main/langs/${locale}.js`)).default
    } catch (e) {
        console.warn('parent-ui ', e)
    }
    try {
        messagesElementEnglish = (await fetchElementUILocale(langBase));
        messagesElement = langBase === locale ? {} : (await fetchElementUILocale(locale));
        // console.log('messagesElementEnglish', messagesElementEnglish)
    } catch (e) {
        console.warn('Element ', e)
    }
    const transList = (await $$get('/commonData/selectList/translation', ({lang: locale})))
    const messagesBack = {}
    transList.forEach(item => {
        messagesBack[item.code || item.msgKey] = item.content || item.template
    })
    const content = {...messagesParentEnglish, ...messagesElementEnglish, ...messagesEnglish, ...messagesVantEnglish, ...messagesParent, ...messagesElement, ...messagesVant, ...messages, ...messagesBack}
    // console.log('content', content)
    // console.log('messagesBack',messagesBack)
    i18n.setLocaleMessage(locale, content)
    // vant-ui 切换语言
    window.vant && window.vant.Locale.use(locale, messagesVant)
    // ELEMENT.locale(ELEMENT.lang['en'])
}

// 注册 i18n 的动态切换语言函数
i18n.changeLanguage = async (locale) => {
    console.log('changeLanguage ', locale)
    await setLocaleMessages(locale)
    i18n.locale = locale
}
// element-ui 切换语言 托管给i18n
Vue.use(ELEMENT, {i18n: (key, value) => i18n.t(key, value)});

export default i18n


async function fetchElementUILocale(locale) {
    // 构建 URL
    const url = `https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/locale/${sysElementLangMap[locale] || locale}.js`;

    // 获取语言文件
    const response = await fetch(url);
    if (response.ok) {
        // 获取文件内容
        const scriptText = await response.text();
        const exports = {};
        const module = {exports};
        eval(`(function () {
            ${scriptText}
        })(module, exports);`);
        return module.exports.default || module.exports; // 格式化为 JSON 字符串
    } else {
        throw new Error(`Error fetching Element UI locale: ${response.statusText}`);
    }
}
