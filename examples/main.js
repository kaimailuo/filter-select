import Vue from 'vue'
import App from './App.vue'
import { 
  List,
  Select,
  Button,
  Popover,
  Cascader,
  Input,
} from 'ant-design-vue'

import { FilterSelect } from '../packages'

Vue.config.productionTip = false

Vue.use(FilterSelect)
Vue.use(List)
Vue.use(Select)
Vue.use(Button)
Vue.use(Popover)
Vue.use(Cascader)
Vue.use(Input)

new Vue({
  render: h => h(App),
}).$mount('#app')
