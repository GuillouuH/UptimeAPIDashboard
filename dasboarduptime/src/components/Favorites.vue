<template>
    <div class="favorites">
        <div class="row d-flex justify-content-center">
            <div v-for="(favorite) in favorites" :key="favorite.id" class="btn-group col-lg-2 col-md-2 col-sm-4 col-8 mb-2" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-primary" :data-id="favorite._id" :data-value="favorite.name" @click.prevent="favoriteSearch"> {{favorite.name}} </button>
                <button type="button" class="btn btn-primary" :data-id="favorite._id" @click.prevent="removeFavorite" aria-label="Close">
                    <span aria-hidden="true" :data-value="favorite">&times;</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['favorites'],
    name: 'Favorites',
    data(){
        return{
        }
    },
    methods: {
        favoriteSearch: function(event) {
            let vm = this;
            let value = $(event.target).attr("data-value");
            vm.$emit('searchInTab', value);
        },
        removeFavorite: function(event){
            let vm = this;
            let value = $(event.target).attr("data-id");
            if(value === undefined)
                value = $(event.target).parent().attr("data-id");
            vm.$emit('removeFavorite', value);
        }
    }
}
</script>