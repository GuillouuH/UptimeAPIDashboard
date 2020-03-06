<template>
    <div id="toast">
        <div class="toast p-3 mb-2 bg-success text-white"  data-autohide="true" data-delay="5000" data-animation="true" style="position: absolute; top: 10px; right: 10px; z-index:10000">
            <div class="toast-body">
                Site modifié avec succés
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Toast',
    methods: {
        openToast(){
            $('.toast').toast('show')
        }
    }
}
</script>
<style>
    .toast {
        font-size: 15px;
    }
</style>