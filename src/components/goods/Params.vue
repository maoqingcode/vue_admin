<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="selectedCateKeys"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <!-- 添加动态参数的面板 将标签页改为many -->
      <el-tab-pane label="动态参数" name="many">
        <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click="addDialogVisible=true"> 添加参数
        </el-button>
        <!-- 动态参数表格 -->
        <el-table :data="manyTableData" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 循环渲染Tag标签 -->
              <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                {{item}}</el-tag>
              <!-- 输入的文本框 -->
              <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!-- 添加按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click='removeParams(scope.row.attr_id)'>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 添加静态属性的面板 将标签页改为only -->
      <el-tab-pane label="静态属性" name="only">
        <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click="addDialogVisible=true">添加属性
        </el-button>
        <!-- 静态属性表格 -->
        <el-table :data="onlyTableData" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
             <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" @click='removeParams(scope.row.attr_id)' type="danger" icon="el-icon-delete">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>
    <!-- 添加参数或属性对话框 -->
    <el-dialog :title="'添加'+titleText" :visible="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      selectedCateKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // tab页签激活显示的页签项
      activeName: 'many',
      // 用来保存动态参数数据
      manyTableData: [],
      // 用来保存静态属性数据
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        att_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.queryCateList()
  },
  computed: {
    //   按钮禁用
    isButtonDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的Id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  },
  methods: {
    async queryCateList () {
      const {
        data: res
      } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      this.catelist = res.data
    },
    handleChange (value) {
      console.log(this)
      this.getParamData()
    },
    handleTabClick () {
      this.getParamData()
    },
    async getParamData () {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return null
      }
      const {
        data: res
      } = await this.$http.get(
          `categories/${this.cateId}/attributes`, {
            params: {
              sel: this.activeName
            }
          }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      console.log(res.data)

      res.data.forEach(item => {
        console.log(typeof item.attr_vals)
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      }
      )

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed () {
      this.addDialogVisible = false
    },
    addParams () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) {
          return
        }
        const {
          data: res
        } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getParamData()
        this.addDialogVisible = false
      })
    },
    async removeParams (attId) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示', {

          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).catch(err => err)
      // 用户取消了删除的操作
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const {
        data: res
      } = await this.$http.delete(`categories/${this.cateId}/attributes/${attId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }

      this.$message.success('删除参数成功！')
      this.getParamData()
    },
    editParams () {
      this.$refs.editFormRef.validate(async val => {
        if (!val) return
        const {
          data: res
        } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改参数成功！')
        this.getParamData()
        this.editDialogVisible = false
      })
    },
    async showEditDialog (attrId) {
      const {
        data: res
      } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`)

      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 关闭标签
    handleClose (index, item) {
      item.attr_vals.splice(index, 1)
      this.saveAttrVals(item)
    },
    // 保存修改后的标签
    saveAttrVals (item) {
      const { data: res } = this.$http.put(`categories/${this.cateId}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: item.attr_sel,
        attr_vals: item.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 显示添加标签
    showInput (item) {
      item.inputVisible = true
      this.$nextTick(val => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (item) {
      if (item.inputValue.trim().length === 0) {
        item.inputVisible = false
        item.inputValue = ''
        return
      }
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      item.inputVisible = false
      this.saveAttrVals(item)
    }
  }

}

</script>

<style lang="less" scoped>
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
  }

</style>
