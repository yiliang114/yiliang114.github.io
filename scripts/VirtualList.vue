<template>
  <div class="virtual">
    <!-- virtual-list 部分需要超出  virtual 才可以滑动 -->
    <div
      class="virtual-list"
      :style="{
        paddingTop: offsetTop,
        paddingBottom: offsetBottom,
      }"
    >
      <slot v-bind:data="dataToShow">
        <div class="virtual-item" :key="index" v-for="(item, index) in dataToShow">
          <div>{{ item.name }}</div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualList',
  data() {
    return {
      startIndex: 0, // 数据开始下标
      endIndex: 0, // 数据结束下标
      // 缓存显示过的项的数据
      cacheMap: {},
      remain: 10,
      viewItemCount: 0, // 可视区可显示的条数
      scrollTop: 0,
      // 可是范围内的 data
      dataToShow: [],
      target: null,
      itemHeight: 50,
      bRect: null,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalCount() {
      return this.list.length;
    },
    // 通过计算属性可以实现缓存
    offsetTop() {
      let result = 0;
      for (let i = 0; i < this.startIndex; i++) {
        result += this.cacheMap[i].height;
      }
      return `${result}px`;
    },
    // 底部 padding 一直都是 50px
    offsetBottom() {
      return `${50}px`;
    },
  },
  methods: {
    triggerUpdate(startIndex) {
      // 更新开始下标
      this.startIndex = startIndex;
      // 更新结束下标
      this.endIndex = this.startIndex + this.viewItemCount;
      // 判断结束下标有没有超过数据长度
      const over = this.endIndex - this.totalCount;
      // 如果超过，根据实践来调整 startIndex 和 endIndex 的值
      if (over > 0) {
        this.startIndex = this.startIndex - over > 0 ? this.startIndex - over : 0;
        this.endIndex = this.endIndex - over;
      }
      // 取数据
      this.loadData();
    },
    scrollHandler() {
      // scrollTop 滚动条相对于其顶部的偏移。
      const { scrollTop } = this.target;
      // 上滑
      if (scrollTop > this.scrollTop) {
        // 查找
        // this.current = this.cache.find(item => item.bottom >= scrollTop)
        // for (const key in this.cacheMap) {
        //   if (this.cacheMap[key].bottom >= scrollTop) {
        //     this.current = this.cacheMap[key];
        //     break;
        //   }
        // }
        const resultKey = Object.keys(this.cacheMap).find(key => this.cacheMap[key].bottom >= scrollTop);
        if (resultKey) {
          this.current = this.cacheMap[resultKey];
        }
        const { index } = this.current;
        // 缓冲（滚动多少个项之后才再次渲染列表数据）
        if (index - this.startIndex > this.remain - 1) {
          this.triggerUpdate(index);
        }
      } else if (scrollTop < this.scrollTop) {
        // 下滑
        // this.current = this.cache.find(item => item.top >= scrollTop)
        // for (const key in this.cacheMap) {
        //   // 先从缓存中找是否有缓存过的 top 值
        //   if (this.cacheMap[key].top >= scrollTop) {
        //     this.current = this.cacheMap[key];
        //     break;
        //   }
        // }

        const resultKey = Object.keys(this.cacheMap).find(key => this.cacheMap[key].top >= scrollTop);
        if (resultKey) {
          this.current = this.cacheMap[resultKey];
        }

        const { index } = this.current;
        const { startIndex } = this;
        if (index - startIndex < 1) {
          // 如果小于零，则取 0 作为起始下标
          this.triggerUpdate(Math.max(startIndex - this.remain, 0));
        }
      }
      this.scrollTop = scrollTop;
      console.log('cacheMap', this.cacheMap);
    },
    loadData() {
      console.log('this.list', this.list.length);
      // 截取要显示数据
      this.dataToShow = this.list.slice(this.startIndex, this.endIndex);
      // 重新计算项的高度， 并记录到缓存中
      this.$nextTick(() => {
        const vi = document.querySelectorAll('.virtual-item');
        for (let i = 0, len = vi.length; i < len; i++) {
          // 取上一项的下标
          const tempIndex = this.startIndex + i - 1;
          // 获取上一项的 top 值，如果不存在则默认取 0. 一般来说上一项 肯定是存在的
          const top = this.cacheMap[tempIndex] ? this.cacheMap[tempIndex].bottom : 0;
          // 判断是否已经为渲染过的数据，如果没有，则添加到数缓存中
          const { height } = vi[i].getBoundingClientRect();
          if (!this.cacheMap[i + this.startIndex]) {
            const obj = {
              index: i + this.startIndex,
              // 距离顶部的距离
              top,
              height,
              // 距离顶部的距离
              bottom: top + height,
            };
            this.cacheMap[i + this.startIndex] = obj;
          }
        }
      });
    },
  },

  mounted() {
    this.target = document.querySelector('.virtual');
    // 元素大小
    this.bRect = this.target.getBoundingClientRect();
    // 渲染的个数 itemHeight 初始设定的 height
    this.viewItemCount = Math.ceil(this.bRect.height / this.itemHeight) + this.remain;
    // 最后一个的下标
    this.endIndex = this.startIndex + this.viewItemCount;
    // 监听滚动事件 拼接数据
    this.target.addEventListener('scroll', this.scrollHandler);
    this.loadData();
  },
  beforeDestroy() {
    this.target.removeEventListener('scroll', this.scrollHandler);
  },
  watch: {
    // 数据变化时（长度），需要重新计算
    list() {
      this.loadData();
    },
  },
};
</script>

<style>
.virtual {
  position: relative;
  /* 固定高度 */
  /* height: 500px; */
  height: 100vh;
  overflow-y: auto;
}

.virtual-item {
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  padding: 12px;
}
</style>
