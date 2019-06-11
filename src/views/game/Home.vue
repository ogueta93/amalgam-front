<template>
  <div class="animated fadeIn">
      {{ $t("message") }}
  </div>
</template>

<script>
export default {
    name : 'homeView',
    data() {
        return {
           name: null
        }
    },
    mounted: function() {
        /** Initial module instance */
        var that = this;
    },
    updated: function() {
        /** after render */
    },
    methods: {
        
    }
};
</script>