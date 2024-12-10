export default {
    name: 'NumUtil',
    /**
     * 金额格式化
     * @param money     金额
     * @param currency  货币符号
     * @param digit     保留几位小数
     * @param split_3   是否需要每3位正数逗号分割 //'VND' '₫' 需要
     * @param currencyLeft   货币符号是否在左
     * @returns {string}
     */
    formatMoney(money = 0, currency, digit = this.currency, split_3 = false, currencyLeft = true) {
        money = parseFloat(money);
        // 判断是否存在小数部分
        let moneyStr = money % 1 === 0 ? money.toString() : money.toFixed(digit)
        if (split_3) {
            moneyStr = moneyStr.replace(/\d(?=(?:\d{3})+\b)/g, '$&.')
        }
        if (currencyLeft) {
            return currency + ' ' + moneyStr
        } else {
            return moneyStr + ' ' + currency
        }
    },
}
