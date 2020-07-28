<template>
  <div>
    <div class="filter-header">
      <a-select 
        :default-value="dataSource.operator ? dataSource.operator : undefined" 
        :placeholder="dataSource.operator ? '' : '请选择关系'"
        style="width: 80px" 
        @change="(value) => handleHeaderChange(value, dataSource)"
      >
        <a-select-option value="and">
          and
        </a-select-option>
        <a-select-option value="or">
          or
        </a-select-option>
      </a-select>
      <div class="filter-actions" v-if="!dataSource.root">
        <a-button 
          class="filter-minus-btn"
          type="primary" 
          @click="() => handleClickMinus(dataSource.type, parentChildren, dataSource.id)"
        >-</a-button>
        <a-popover v-model="visibleObj[dataSource.id]" trigger="click">
          <div slot="content">
            <a 
              @click="() => handleClickPlus('quota', parentChildren, dataSource.id)"
            >新增指标</a>
          </div>
          <div slot="content">
            <a 
              @click="() => handleClickPlus('relation', parentChildren, dataSource.id)"
            >新增关系</a>
          </div>
          <a-button type="primary">
            +
          </a-button>
        </a-popover>
      </div>
    </div>
    <ul>
      <li 
        v-for="(item, index) in dataSource.children"
        :key="index"
        class="filter-item"
      >
        <div v-if="item.type === 'relation'">
          <FilterItem 
            :dataSource="item"
            :quotaList="quotaList"
            :parentChildren="dataSource.children"
            @handleChange="handleChangeInner"
            @handleMinus="handleClickMinus"
            @handlePlus="handleClickPlus"
            @handleHeaderChange="handleHeaderChange"
          />
        </div>
        <div v-else class="filter-content">
          <a-cascader
            class="filter-cascader"
            v-model="item.name"
            :options="quotaList"
            :show-search="{ filter }"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择指标"
            :allowClear="false"
            @change="(value, selectOption) => handleChangeInner(value, selectOption, item)"
          />
          <a-select 
            class="filter-opr"
            v-if="item.name && metrics && metrics.oprs" 
            v-model="item.opr"
            style="width: 100px" 
            @change="handleChange"
            placeholder="请选择"
          >
            <a-select-option 
              v-for="item in metrics.oprs.split(',')" 
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
          <a-input 
            style="width: 200px" 
            v-if="item.name && metrics && metrics.displayType === 'input'" 
            v-model="item.val"
            placeholder="请输入" 
          />
          <a-select 
            v-if="item.name && metrics && metrics.vals && metrics.displayType === 'single_select'" 
            v-model="item.val"
            style="width: 200px" 
            @change="handleChange"
            placeholder="请选择"
          >
            <a-select-option 
              v-for="item in metrics.vals.split(',')" 
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
          <a-select 
            v-if="item.name && metrics && metrics.vals && metrics.displayType === 'multi_select'" 
            mode="multiple"
            v-model="item.val"
            style="width: 200px" 
            @change="handleChange"
            placeholder="请选择"
          >
            <a-select-option 
              v-for="item in metrics.vals.split(',')" 
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
          <a-select 
            v-if="item.name && metrics && metrics.displayType === 'category_1' && category" 
            v-model="item.val"
            style="width: 200px" 
            @change="handleChange"
            placeholder="请选择"
          >
            <a-select-option 
              v-for="item in category" 
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-cascader
            style="width: 300px" 
            v-if="item.name 
              && metrics 
              && (metrics.displayType === 'category_2' 
              || metrics.displayType === 'category_3' 
              || metrics.displayType === 'category_4') 
              && category" 
            v-model="item.val"
            :options="category"
            :show-search="{ filter }"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择"
            :allowClear="false"
          />
          <div class="filter-actions">
            <a-button 
              class="filter-minus-btn"
              type="primary" 
              @click="() => handleClickMinus(item.type, dataSource.children, item.id, index)"
            >-</a-button>
            <a-popover v-model="visibleObj[item.id]" trigger="click">
              <div slot="content">
                <a @click="() => handleClickPlus('quota', dataSource.children, item.id, index)">新增指标</a>
              </div>
              <div slot="content">
                <a @click="() => handleClickPlus('relation', dataSource.children, item.id, index)">新增关系</a>
              </div>
              <a-button type="primary">
                +
              </a-button>
            </a-popover>
          </div>
        </div>
      </li>
    </ul>
  </div>
    
</template>

<script>

const metrics = {
  "id":222,
  "name":"title",
  "dataType":"text",//指标数据类型
  "displayType":"category_2",//展示类型
  "vals":"KA,NKA",//展示值
  "oprs":"like,not_like", //运算符
}

const category = [
  {
    "id":"122223",
    "name":"home & garden",
    "children": [
      {
        "id":"121",
        "name":"home & garden111"
      },
      {
        "id":"122",
        "name":"home & garden222"
      }
    ]
  }
]

export default {
  name: 'FilterItem',
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {}
      }
    },
    quotaList: {
      type: Array
    },
    parentChildren: {
      type: Array,
      default: () => {
        return []
      }
    },
    // handleChange: {
    //   type: Function,
    //   default: () => {
    //     return () => {}
    //   }
    // }
  },
  data() {
    return {
      visibleObj: {},
      metrics,
      category,
    }
  },
  methods: {
    handleChangeInner(value, selectOption, item) {
      // if (value) {
        
      // }
      this.$emit('handleChange', value, selectOption, item)
    },
    handleChange(value, item) {
      this.$emit('handleChange', value, item)
    },
    handleClickMinus(type, arr, index) {
      this.$emit('handleMinus', type, arr, index)
    },
    handleClickPlus(type, arr, id ,index) {
      this.$emit('handlePlus', type, arr, id, index)
      this.$set(this.visibleObj, id, false)
      console.log(id, this.visibleObj, type, arr, index)
    },
    handleHeaderChange(value, data) {
      this.$emit('handleHeaderChange', value, data)
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin-left: 20px;
}
a {
  color: #42b983;
}
.filter-header {
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
}
.filter-item:after {
  content:""; 
  display: block; 
  clear:both;
}
.filter-item {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
}
.filter-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}
.filter-item:first-child {
  margin-top: 10px;
}
/* .filter-content {
  float: left;
} */
.filter-actions {
  float: right;
}
.filter-minus-btn {
  margin-right: 10px;
}
.filter-cascader, .filter-opr {
  margin-right: 10px;
}
</style>
