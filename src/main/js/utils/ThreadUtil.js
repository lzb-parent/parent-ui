export default {
    name: 'ThreadUtil',
    /**
     * 防抖动 (例如: 1秒内触发一次该方法)
     * @param func  执行方法
     * @param wait  毫秒
     */
    debounce(func, wait) {
        let timeout;

        return function (...args) {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    },
    /**
     *
     *     // 示例用法
     *     const debouncedFunction = debounceWithKey((key, value) => {
     *       console.log(`Executing with key: ${key}, value: ${value}`);
     *     }, 1000);
     *
     *     debouncedFunction("A", 1); // 执行
     *     debouncedFunction("B", 2); // 执行
     *     debouncedFunction("A", 3); // 1秒后执行，因为 "A" 已经执行过
     *     debouncedFunction("C", 4); // 执行
     */
    debounceWithKey(func, wait) {
        let timeout;
        const executedKeys = new Set();

        return function (key, ...args) {
            clearTimeout(timeout);

            if (!executedKeys.has(key)) {
                // 如果 key 没有被执行过，则执行函数并将 key 添加到 executedKeys 中
                func.apply(this, [key, ...args]);
                executedKeys.add(key);
            }

            timeout = setTimeout(() => {
                // 清除 key 记录，以便下一次 key 可以被执行
                executedKeys.delete(key);
            }, wait);
        };
    },
}
