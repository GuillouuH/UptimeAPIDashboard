<template>
    <div class="header">
        <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark tablesortable" role="navigation">
            <div class="container">
                <router-link v-if="options.hasSearch == false" :to="{name:'Result', params:{
                    id:$route.params.idAccount,
                    year: date,
                    search: $route.params.search,
                    interval:$route.params.interval,
                    daysSelected:$route.params.daysSelected
                }}"><a class="navbar-brand" href="#">Disponibilité - Statistiques</a></router-link>
                <router-link v-else :to="{name:'Result'}"><a class="navbar-brand" href="#">Disponibilité - Statistiques</a></router-link>
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                        <div v-if="options.hasDate == true" class="dropdown">
                            <button class="btn btn-outline-primary my-2 my-sm-0 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{date}}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <h6 class="dropdown-header">Sélectionner une année :</h6>
                                <template v-if="$route.name === 'Dashboard'">
                                    <router-link v-for="month in months" :key="month.id" :to="{name:'Dashboard', params:{year:month.year, id:idAccount}}" :class="{active : month.year==date}" tag="a" class="dropdown-item">{{month.year}}</router-link>
                                </template>
                                <template v-else>
                                    <router-link v-for="month in months" :key="month.id" :to="{name:month.routeName, params:{year:month.year, id:idAccount}}" :class="{active : month.year==date}" tag="a" class="dropdown-item">{{month.year}}</router-link>
                                </template>
                            </div>
                        </div>&nbsp;

                        <div v-if="options.hasAccount == true" class="dropdown">
                            <button class="btn btn-outline-primary my-2 my-sm-0 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{selectAccount}}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <h6 class="dropdown-header">Sélectionner un compte :</h6>
                                <template v-if="$route.name === 'Dashboard'">
                                    <router-link v-for="(account, index) in accounts" :key="index" :to="{name:'Dashboard', params:{id: index, year:date}}" :class="{active : index==idAccount}"  tag="a" class="dropdown-item">{{account.name}}</router-link>
                                </template>
                                <template v-else>
                                    <router-link v-for="(account, index) in accounts" :key="index" :to="{name:'Account', params:{id: index, year:date}}" :class="{active : index==idAccount}"  tag="a" class="dropdown-item">{{account.name}}</router-link>
                                </template>
                            </div>
                        </div>&nbsp;
                        <button v-if="options.hasDashboard == true" class="btn btn-outline-primary my-2 my-sm-0" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <router-link :to="{name:'Dashboard', params:{
                                    id:idAccount,
                                    year: date,
                                }
                            }" id="dashboard-link" tag="a">Dashboard</router-link>
                        </button>
                    </ul>
                    <button v-if="options.hasCount == true" type="button" class="btn btn-outline-primary my-2 my-sm-0 mr-2">
                        {{nbElement}}
                    </button>
                    <button v-if="options.hasCsv == true" class="btn btn-outline-primary my-2 my-sm-0" type="" @click.prevent="downloadCsv"><span class="fas fa-cloud-download-alt" aria-hidden="true"></span> CSV</button>
                        &nbsp;
                    <template v-if="options.hasSearch == true">
                        <div class="my-2 my-lg-0">
                            <div class="input-group">
                                <input class="form-control" type="text" id="search" placeholder="Rechercher" v-model="searchInput" @keyup="searchInTab">
                                <div class="input-group-append">
                                    <div class="input-group-append">
                                        <button class="btn" type="button" @click.prevent="addFavorites" :disabled="searchInput == ''"><span class="fas fa-star addFavorite" aria-hidden="true"></span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import moment,{ duration } from 'moment'
import axios from 'axios'

export default {
    props: ['options', 'date', 'searchinput', 'accounts', 'idAccount', 'nbElement'],
    name: 'Header',
    data(){
        return{
            search : this.searchInput
        }
    },
    computed : {
        searchInput : {
            get: function () {
                return this.searchinput
            },
            set: function(value) {
                this.search = value;
            }
        },
        months:{
            get : function(){
                let currentYear = parseInt(moment().format('YYYY'));
                let year = [
                  {year :currentYear-2, current:false, routeName:'History'},
                  {year :currentYear-1, current:false, routeName:'History'},
                  {id:this.idAccount,year :currentYear, current:true, routeName:'History'}
                  ];

                return year;
            }
        },
        selectAccount: {
            get : function(){
                let currentAccount = this.accounts[this.idAccount]["name"];
                return currentAccount;
            }
        },
    },
    methods: {
        searchInTab (e) {
            var vm = this;
            if(e != null)
                if (e.keyCode === 10 || e.keyCode === 13)
                    e.preventDefault();

            vm.$emit('searchInTab', vm.search);
        },
        downloadCsv (e){
            var vm = this;
            vm.$emit('downloadCsv');
        },
        addFavorites (e) {
            let valToAdd = this.search;
            this.$emit('addFavorites', valToAdd);
        }
    }
}
</script>
<style>
#dashboard-link {
    color:inherit;
    text-decoration: none;
}
</style>

