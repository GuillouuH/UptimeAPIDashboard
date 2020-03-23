<template>
    <div id="admin_add_group">
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout d'un group de notification</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="siteName">Nom</label>
                            <input type="text" class="form-control" id="groupeName" placeholder="Entrer un nom" v-model="newGroup.name">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="saveAdd">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddGroupModal',
    props: ['newGroup'],
    methods : {
        saveAdd : function(){
            this.$emit('saveAddGroup');
        }
    }
}
</script>
<style scoped>

</style>