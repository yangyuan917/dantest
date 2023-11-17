import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: {
      title: '401'
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/asset-allocation',
    children: [
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
        meta: { title: '大类资产', icon: '', affix: true }
      },
      {
        path: '/stock',
        component: () => import('@/views/allocation/stock.vue'),
        name: 'stock',
        meta: { title: '股票', icon: '', affix: true }
      },
      {
        path: '/foundation',
        component: () => import('@/views/allocation/foundation.vue'),
        name: 'foundation',
        meta: { title: '基金', icon: '', affix: true }
      },




      {
        path: '/table-details',
        component: () => import('@/views/allocation/table-details.vue'),
        name: 'table-details',
        meta: { title: '表格详情', icon: '', affix: true }
      },
      {
        path: '/stock-table-details',
        component: () => import('@/views/allocation/stock-table-details.vue'),
        name: 'stock-table-details',
        meta: { title: '股票表格详情', icon: '', affix: true }
      },
      {
        path: '/foundation-table-details',
        component: () => import('@/views/allocation/foundation-table-details.vue'),
        name: 'foundation-table-details',
        meta: { title: '基金表格详情', icon: '', affix: true }
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

      // {
      //   path: '/home',
      //   component: () => import('@/views/home/index.vue'),
      //   name: 'Home',
      //   meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
      // },
      // {
      //   path: '/setting',
      //   component: () => import('@/views/setting/index.vue'),
      //   name: 'Setting',
      //   meta: { title: '设置', icon: 'el-icon-s-tools', roles: ['admin'] }
      // },

      // {
      //   path: '/menu',
      //   name: 'Menu',
      //   component: () => import('@/views/menu/index.vue'),
      //   meta: { title: '菜单', icon: 'el-icon-menu', roles: ['admin', 'editor'] },
      //   redirect: '/menu2',
      //   children: [
      //     {
      //       path: '/menu1',
      //       name: 'Menu1',
      //       component: () => import('@/views/menu/menu10.vue'),
      //       meta: { title: '菜单1', roles: ['admin', 'editor'] },
      //       redirect: '/menu1-2',
      //       children: [
      //         {
      //           path: '/menu1-1',
      //           component: () => import('@/views/menu/menu11.vue'),
      //           name: 'Menu1-1',
      //           meta: { title: '菜单1-1', roles: ['admin'] }
      //         },
      //         {
      //           path: '/menu1-2',
      //           component: () => import('@/views/menu/menu12.vue'),
      //           name: 'Menu1-2',
      //           meta: { title: '菜单1-2', roles: ['admin', 'editor'] }
      //         }
      //       ]
      //     },
      //     {
      //       path: '/menu2',
      //       component: () => import('@/views/menu/menu2.vue'),
      //       name: 'Menu2',
      //       meta: { title: '菜单2', roles: ['admin', 'editor'] }
      //     }
      //   ]
      // },
      // {
      //   path: '/star',
      //   component: () => import('@/views/star/index.vue'),
      //   name: 'Star',
      //   meta: { title: '图表', icon: 'el-icon-s-data', roles: ['admin', 'editor'] }
      // },
      // {
      //   path: '/xueyue',
      //   component: () => import('@/views/xueyue/index.vue'),
      //   name: 'Xueyue',
      //   meta: { title: '雪月', icon: 'el-icon-s-flag', roles: ['admin'] }
      // }
    ]
  }
]

export const asyncRoutes = []

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
