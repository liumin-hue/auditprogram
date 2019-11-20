<template>
    <div class="spinner">
        <mt-popup v-model="showSpinner" popup-transition="popup-fade" :closeOnClickModal="false">
            <mt-spinner type="double-bounce" color="#26a2ff">123</mt-spinner>
        </mt-popup>
    </div>
</template>
<script>
//引入mint-ui插件
import { Spinner ,Popup } from "mint-ui";

export default {
  data() {
    return {
        
    };
  },
  props: ["showSpinner"],
};
</script>
<style scoped>

</style>
