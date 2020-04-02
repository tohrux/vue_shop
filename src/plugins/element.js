import Vue from 'vue'
import { Timeline, TimelineItem, Upload, Checkbox, CheckboxGroup, Step, Steps, Tabs, TabPane, Alert, Cascader, Select, Option, Tree, Tag, Dialog, Pagination, Tooltip, Switch, TableColumn, Table, Row, Col, Card, Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, Message, Container, Aside, Main, Header, Submenu, Menu, MenuItemGroup, MenuItem, MessageBox } from 'element-ui'

Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
