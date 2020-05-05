<template>
  <div>
    <h3>添加商品</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>

      <!-- 步骤条组件 -->
      <!-- align-center(居中效果) -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域:el-tab-pane必须是el-tabs的子节点
            :tab-position="'left'"(设置tab栏为左右结构tab栏) -->
      <!-- 表单：label-position="top"(设置label在文本框上方) -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals" @change='testChange'>
                <el-checkbox :label="cb" v-for="(cb, i) in paramBoxs[index]" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
              :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器组件 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <!-- 添加商品按钮 -->
              <el-button type="primary" class="btnAdd" @click='add'>添加商品</el-button>
          </el-tab-pane>

        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        // 商品的详情介绍
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        }],
        goods_cat: [{
          required: true,
          message: '请选择商品分类',
          trigger: 'blur'
        }]
      },
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      paramBoxs: [],
      // 上传图片的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 保存预览图片的url地址
      previewPath: '',
      // 控制预览图片对话框的显示和隐藏
      previewVisible: false
    }
  },
  computed: {

  },
  created () {
    this.getCateList()
  },
  methods: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
    // 获取所有商品分类数据
    async getCateList () {
      const {
        data: res
      } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }

      this.catelist = res.data
      console.log(this.catelist)
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 再到methods编写事件函数beforeTabLeave
    beforeTabLeave (activeName, oldActiveName) {
      // 在tab栏切换之前触发，两个形参为切换前，后的tab栏name
      if (oldActiveName === '0') {
        // 在第一个标签页的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        }
        // } else if (this.addForm.goods_name.trim() === '') {
        //   this.$message.error('请输入商品名称')
        //   return false
        // } else if (this.addForm.goods_price.trim() === '0') {
        //   this.$message.error('请输入商品价格')
        //   return false
        // } else if (this.addForm.goods_weight.trim() === '0') {
        //   this.$message.error('请输入商品重量')
        //   return false
        // } else if (this.addForm.goods_number.trim() === '0') {
        //   this.$message.error('请输入商品数量')
        //   return false
        // }
      }
    },
    async tabClicked () {
      console.log(this.cateId())
      // 当用户点击切换tab栏时触发
      if (this.activeIndex === '1') {
        // 发送请求获取动态参数
        const {
          data: res
        } = await this.$http.get(
            `categories/${this.cateId()}/attributes`, {
              params: {
                sel: 'many'
              }
            }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        // 将attr_vals字符串转换为数组
        res.data.forEach(item => {
          item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          this.paramBoxs.push(item.attr_vals)
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
        // this.paramBoxs = this.manyTableData
      } else if (this.activeIndex === '2') {
        // 发送请求获取静态属性
        const {
          data: res
        } = await this.$http.get(
            `categories/${this.cateId()}/attributes`, {
              params: {
                sel: 'only'
              }
            }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败')
        }

        this.onlyTableData = res.data
      }
    },
    handlePreview (file) {
      console.log(file)
      console.log('TupianPreview')
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // console.log(response)
      // 1. 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm)
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    add () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请填写必要表单')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log('form-------------')
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.message)
        }
        this.$message.info(res.meta.msg)
        this.$router.push('/goods')
      })
    },
    testChange () {
      // console.log(this.manyTableData)
    }
  }

}

</script>

<style lang="less" scoped>
  .previewImg {
    width: 100%;
  }
//给添加商品按钮添加间距
.btnAdd{
  margin-top:15px;
}
</style>
