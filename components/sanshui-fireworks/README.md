## 使用注意
- 引入该组件，用v-if控制组件，组件create会触发喷发特效函数，然后可以传入一些位置参数，具体参考组件内的props属性，每个属性都备注了
- 
## 示例代码
```
  <template>
  	<view>
  		<fireworks v-if="isReady" />
  	</view>
  </template>
  
  <script>
  	import fireworks from '@/components/fireworks/index.vue'
  	export default {
		data() {
			return {
				isReady: false
			}
		},
  		components: {
  			fireworks
  		},
		onReady() {
			this.$nextTick(() => {//后面记得销毁哈，不使用时设置为false
				setTimeout(() => {
					this.isReady = true;
				}, 50)
			})
		},
  	}
  </script>
```