<template>
    <div class="editorsNote">
        
    </div>
</template>
<script>
import LandReport from "@/api/LandReportApi" //引入api
export default {
    name:'editorsNote',
    components:{
        
    },
    data() {
      return {
          
      };
    },
}
</script>
<style lang="scss">
.editorsNote{
    position: absolute;
    width: 300px;
    left: 0;
    top: 0;
    bottom: 0px;
    display: flex;
    z-index: 9;
    background: hsl(0, 29%, 95%);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height:calc(100% - 40px);
    margin-top:40px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
</style>