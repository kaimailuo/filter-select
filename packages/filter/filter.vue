<template>
  <div class="filter-wrapper">
    <FilterItem 
      :dataSource="data" 
      :quotaList="quotaList"
      @handleChange="handleChange"
      @handleMinus="handleMinus"
      @handlePlus="handlePlus"
      @handleHeaderChange="handleHeaderChange"
    />
    <a-button 
      type="primary"
      @click="handleSubmit"
    >保存</a-button>
  </div>
</template>

<script>
import FilterItem from './filterItem'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'FilterSelect',
  components: {
    FilterItem
  },
  props: {
    quotaList: {
      type: Array,
      default() {
        return [{
          "children":[
            {
              "id":222,//指标id
              "name":"title" //指标name
            }
          ],
          "id":"31", //分组id
          "name":"基本信息" //分组名字
        }]
      }
    }
  },
  data() {
    return {
      data: {
        root: true,
        operator: 'and',
        id: uuidv4(),
        children: [
          { type: 'quota', id: uuidv4(), name: undefined, opr: undefined, val: undefined},
          // { 
          //   type: 'relation', 
          //   id: uuidv4(),
          //   operator: 'or',
          //   children: [
          //     { type: 'quota', id: uuidv4(),  },
          //     { 
          //       type: 'relation', 
          //       id: uuidv4(),
          //       operator: '',
          //       children: []
          //     }
          //   ]
          // }
        ]
      }
    }
  },
  methods: {
    handleChange(value, selectOption, item) {
      console.log(`selected ${value}`, selectOption, item);
    },
    handlePlus(type, arr, id, index) {
      console.log('plus', type, arr, index);
      if (type === 'quota') {
        arr.splice(index + 1, 0, { type: 'quota', id: uuidv4(), name: undefined, opr: undefined, val: undefined })
      } else {
        const itemIndex = arr.findIndex(item => {
          return item.id === id
        })
        arr.splice(itemIndex + 1, 0, { 
          type: 'relation', 
          id: uuidv4(),
          operator: 'and',
          children: [
            { type: 'quota', id: uuidv4(), name: undefined, opr: undefined, val: undefined },
          ]
        })
      }
    },
    handleMinus(type, arr, id, index) {
      console.log('minus', type, arr, index);
      if (type === 'quota' && arr.length > 1) {
        arr.splice(index, 1)
      } else if ( arr.length > 1) {
        const itemIndex = arr.findIndex(item => {
          return item.id === id
        })
        arr.splice(itemIndex, 1)
      }
    },
    handleHeaderChange(value, data) {
      if (!data.root && !data.operator) {
        data.children = [
          { type: 'quota', id: uuidv4(),  },
          // { 
          //   type: 'relation', 
          //   id: uuidv4(),
          //   operator: '',
          //   children: []
          // }
        ]
      }
      data.operator = value
    },
    handleSubmit() {
      console.log(this.data);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.filter-wrapper {
  padding: 0 20px;
}
</style>
