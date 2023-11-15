<template>
<keep-alive  >
  <router-view />

</keep-alive>
</template>
<style>
.all-page-flex{
  display: flex;
  flex-wrap: wrap;
  /* padding: 20px; */
  padding-top: 4px;
  /* gap: 8px; */
  /* background-color: #EFF1F6; */

}

.echarts-box{
 width: calc(33.33% - 20px);
margin: 0 10px;

/* border-bottom: 1px solid black; */


}
.line {
  height: 1px;
  background-color: #080808;
  margin-top: 10px;
  margin-bottom: 10px;
}

</style>
