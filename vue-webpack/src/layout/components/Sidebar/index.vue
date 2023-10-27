<template>
  <div class="sidebar-container">
    <div class="logo" @click="$router.push('/')">
      <img class="logo-img" :src="require('@img/logo.jpg')" alt="logo" />
      <transition name="el-zoom-in-center">
        <div v-show="opened" class="logo-text"> AssetAnalysis分析师 </div>
      </transition>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :router="true"
        :default-active="$route.path"
        :collapse="isCollapse"
        :show-timeout="200"

      >
        <SidebarItem v-for="item in routerList" :key="item.path" :index="item.path" :nav="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { constantRoutes } from '@/router'
import { getRoles } from '@/utils/auth'
import SidebarItem from './SidebarItem.vue'

const roles = getRoles()
const store = useStore()
const routerList = reactive([


      {
        path: '/asset-allocation',
        component: () => import('@/views/allocation/asset-allocation.vue'),
        name: 'assetAllocation',
        meta: { title: '大类资产配置', icon: '', affix: true }
      },
      {
        path: '/asset-plan',
        component: () => import('@/views/allocation/asset-plan.vue'),
        name: 'assetPlan',
        meta: { title: '资管计划', icon: '', affix: true }
      },
      {
        path: '/asset-page',
        component: () => import('@/views/allocation/asset-page.vue'),
        name: 'asset-page',
        meta: { title: '页面三', icon: '', affix: true }
      },

          {
            path: '/fixed-income',
            component: () => import('@/views/allocation/fixed-income.vue'),
            name: 'fixed-income',
            meta: { title: '固定收益', icon: '', affix: true }
          },
      {
        path: '/price-monitor',
        component: () => import('@/views/price-monitor/index.vue'),
        name: 'price-monitor',
        meta: { title: '价格监测', icon: '', affix: true },
         redirect: '/fixed-income',
        children: [
          {
            path: '/fixed-income',
            component: () => import('@/views/allocation/fixed-income.vue'),
            name: 'fixed-income',
            meta: { title: '固定收益', icon: '', affix: true }
          },
          {
            path: '/marke-trisk',
            component: () => import('@/views/allocation/marke-trisk.vue'),
            name: 'marke-trisk',
            meta: { title: ' 市场风险', icon: '', affix: true }
          }
        ]
      },
      {
        path: '/amarket-monitor',
        component: () => import('@/views/market-monitor/index.vue'),
        name: 'amarket-monitor',
        meta: { title: '市场监测', icon: '', roles: ['admin', 'editor'], affix: true },
        redirect: '/macro-interest-rate',
        children: [
          {
            path: '/macro-interest-rate',
            component: () => import('@/views/market-monitor/macro-interest-rate.vue'),
            name: 'macro-interest-rate',
            meta: { title: '宏观利率', icon: '', affix: true }
          },
          {
            path: '/capital-flow',
            component: () => import('@/views/market-monitor/capital-flow.vue'),
            name: 'capital-flow',
            meta: { title: ' 资金流向', icon: '', affix: true }
          },
          {
            path: '/real-estate',
            component: () => import('@/views/market-monitor/real-estate.vue'),
            name: 'real-estate',
            meta: { title: '房地产', icon: '', affix: true }
          },
          {
            path: '/monitor-target-tank',
            component: () => import('@/views/market-monitor/monitor-target-tank.vue'),
            name: 'assetPage',
            meta: { title: ' 标的池', icon: '', affix: true }
          }
        ]
      }

])

const opened = computed(() => store.state.app.sidebar.opened)
const isCollapse = computed(() => !opened.value)

onMounted(() => {
  filterRoutes()
})

/**
 * 权限过滤路由
 */
const filterRoutes = () => {
  constantRoutes.forEach((item) => {
    if (item.path === '/') {
      // routerList.push(...item.children)
    }
  })
//下面是过滤权限用的，后面用到可以解开
  // for (let i = 0; i < routerList.length; i++) {
  //   if (
  //     routerList[i].meta &&
  //     routerList[i].meta.roles &&
  //     !routerList[i].meta.roles.includes(roles)
  //   ) {
  //     routerList.splice(i, 1)
  //     i--
  //   }
  // }
  // filterChildrens(routerList)
}

/**
 * 权限过滤子路由
 */
const filterChildrens = (routers) => {
  const childrens = []
  routers.forEach((item) => {
    if (
      (item.meta && !item.meta.roles) ||
      (item.meta && item.meta.roles && item.meta.roles.includes(roles))
    ) {
      childrens.push(item)
      if (item.children) {
        filterChildrens(item.children)
      }
    }
  })
  routers.length = 0
  routers.push(...childrens)
}
</script>

<style lang="scss" scoped="scoped">
.logo {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  // overflow: hidden;
  text-align: center;
  cursor: pointer;
  background-color: #2b2f3a;

  .logo-img {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    display: inline-block;
    height: 50px;
    // margin-left: 12px;
    font-size: 12px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
