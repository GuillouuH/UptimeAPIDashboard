<template>
    <div class="admin_breadcrumb">
        <nav aria-label="breadcrumb bg-dark">
            <ol class="breadcrumb  bg-dark">
                <li class="breadcrumb-item" :class="{'breadcrumb-active':!!breadcrumb.link, 'breadcrumb-inactive':!breadcrumb.link}" v-for="(breadcrumb,idx) in data"  @click="routeTo(idx)" :key="idx">
                    <template>{{breadcrumb.name}}</template>
                </li>
            </ol>
        </nav>
    </div>
</template>
<script>
export default {
    name: 'AdminBreadcumb',
    props: ['data'],
    methods: {
        routeTo: function(id){
            if(this.data[id].link)
                this.$router.push(this.data[id].link)
        }
    }
}
</script>
<style>
.breadcrumb-active {
    color : #0fd5c0
}
.breadcrumb-inactive {
    color: aliceblue;
}
</style>