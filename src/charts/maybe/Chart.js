// chart mixin
// NOTE: 不是组件，不能用于实例化


const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1
const SCROLL_EVENT = 'scroll'// isFirefox ? 'DOMMouseScroll' : 'mousewheel'


export default {
  props: {
    scrollLoad: { type: Boolean, default: false },
    onScroll: { type: Function, default: null }
  },

  data () {
    return {
      _baseHasInit: false,
      _$$value: null
    }
  },

  methods: {
    _scrollListener () {
      
      console.log(SCROLL_EVENT, window.innerHeight)

      if (
        window.scrollY + window.innerHeight >= this.$el.offsetTop
        && this.value && _.flattenDeep(this.value).length > 0
      ) {
        this._initialize()
        this._removeScrollListen()
      }
    },


    _addScrollListen () {
      window.addEventListener(SCROLL_EVENT, this._scrollListener, { passive: true })
    },

    _removeScrollListen () {
      window.removeEventListener(SCROLL_EVENT, this._scrollListener)
    },

    _initialize () {
    

      this.init()
      this._baseHasInit = true
    },

    
  },

  watch: {
    ['value'] (newVal) {
      // 没有被初始化过
      if (!this._baseHasInit) return 
      if (newVal === null || _.flattenDeep(newVal).length === 0) {
        this.$el.children[0].style.opacity = 0
        return
      }
       // redraw 
      this.$el.children[0].style.opacity = 1
      this._initialize()
    },
  },

  mounted () {
    if (!this.init || this.initSelf) {
      return 
    }

    this.scrollLoad ? this._addScrollListen() : this._initialize()
  },



  beforeDestroy () {
    
    if (this.chart) {
      this.chart.clear()
      this.chart.dispose()
    }
    else {
      // console.warn('use mixin with on chart[missing this.chart]')
    }
    
    this._removeScrollListen()
    
  }
}