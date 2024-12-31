import StrUtil from './StrUtil'

export let fileServer = null
export default {
    name: 'FileUtil',
    install(fileServerUrl) {
        fileServer = fileServerUrl
    },
    getFileServer() {
        return fileServer
    },
    getUploadPath() {
        return fileServer + '/upload'
    },
    getFileViewUrl(file) {
        if (file && file.indexOf('/static') === 0) {
            let server = fileServer
            server = StrUtil.subStringEnd(server, '/api/')
            server = StrUtil.subStringEnd(server, '/api')
            return server + file
        }
        return file && file.replace(/{host}/g, fileServer)
    },
    getFileViewContent(richTextContent) {
        if (!richTextContent) {
            return richTextContent
        }

        // 匹配 src="file，但排除包含文件流的部分
        const regexPattern = /src="file(?![^<]*base64)/g
        return richTextContent.replace(regexPattern, 'src="' + fileServer + '/file')
    },
    appendContent(type, content) {
        // content.log(`appendContent ${type}` , content)
        const element = document.createElement(type)
        if (type === 'script') {
            element.textContent = content
        } else {
            element.innerHTML = content
        }
        document.body.appendChild(element)
    },
    getAndAppendToBody(type, content) {
        const scriptRegex = new RegExp(`<${type}\\b[^>]*>([\\s\\S]*?)<\\/${type}>`, 'gm')
        const matches = content.match(scriptRegex)

        // 输出匹配到的 JavaScript 代码
        if (matches) {
            matches.forEach((subContent, index) => {
                console.log(`getAndAppendToBody <${type}> ${index + 1}:`)
                this.appendContent(type, subContent.replace(new RegExp(`<${type}\\b[^>]*>|<\\/${type}>`, 'g'), ''))
            })
        } else {
            console.log(`No <${type}> tags found.`)
        }
    },
    downloadFile(fullPath, otherFileName) {
        // Create a link element
        const link = document.createElement('a')

        // Set the href attribute to the file URL
        link.href = fullPath

        // Set the download attribute with the desired file name
        link.download = otherFileName || this.getFileNameFromPath(fullPath)

        // Append the link to the document
        document.body.appendChild(link)

        // Programmatically click the link to trigger the download
        link.click()

        // Remove the link from the document
        document.body.removeChild(link)
    },
    // Helper function to get file name from path
    getFileNameFromPath(path) {
        if (path) {
            const lastSlashIndex = path.lastIndexOf('/')
            return path.substring(lastSlashIndex + 1)
        }
    },
    playAudio(src) {
        const myAudio = new Audio(src)
        // 监听音频元数据加载成功事件
        myAudio.onloadedmetadata = () => {
            console.log('Audio file exists, ready to play');
            if (myAudio.paused) {
                try {
                    const play = myAudio.play();
                    play &&
                    play.catch((e) => {
                        console.error('play error', e);
                        console.warn(
                            '播放音频失败,谷歌不允许自动播放,请随意点一下网站任意位置.'
                        );
                    });
                } catch (e) {
                    console.error('Audio play exception:', e);
                }
            }
        };
    },
    /**
     * 从链接中提取文件名
     * @param {string} url - 文件的完整链接
     * @returns {string} 文件名（包含扩展名）
     */
    extractFileName(url) {
        try {
            // debugger
            if (url.startsWith('/file/')) {
                url = 'http://0.0.0.0' + url
            }
            // 使用 URL 对象解析链接
            const parsedUrl = new URL(url);
            // 获取路径部分并分割，提取最后一个片段作为文件名
            const pathname = parsedUrl.pathname;
            const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
            return fileName;
        } catch (error) {
            console.error('Invalid URL:', url);
            return '';
        }
    }
}
