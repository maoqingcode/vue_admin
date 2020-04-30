import Vue from 'vue'
import
{ Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// Vue.use(MessageBox) ?? 不要直接使用 而是挂载到
// 全局配置需要挂载，以保证所有组件都可以访问到$message
Vue.prototype.$message = Message
// 将Messagebox组件挂载到实例
Vue.prototype.$confirm = MessageBox.confirm
