export default {
  overlay: null,

  // Method to open loading overlay
  open: function() {
    this.overlay = document.createElement('div')
    this.overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 1;
          transition: opacity 0.3s ease;
        `
    this.overlay.innerHTML = '<div>Loading...</div>'
    document.body.appendChild(this.overlay)
  },

  // Method to close loading overlay
  close: function() {
    if (this.overlay) {
      this.overlay.style.opacity = '0'
      setTimeout(() => {
        this.overlay.style.display = 'none'
      }, 300) // 300ms 与 CSS 中 transition 的时间一致
    }
  }
}
