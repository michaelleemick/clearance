<template>
    <div class="about">
      <h1>This is an dsdfsabout page</h1>
    </div>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Api from '../api/Api'

export default defineComponent({
    name : 't86info',
    setup() {
        console.log("dkaldslfad",router)
        const route = useRoute()
        console.log(route.query)
        
        console.log('-----')
    },
})
</script>