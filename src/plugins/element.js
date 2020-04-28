import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 全局配置需要挂载，以保证所有组件都可以访问到$message
Vue.prototype.$message = Message
