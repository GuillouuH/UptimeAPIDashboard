<template>
    <div id="result">
        <Header :options="optionsHeader" @addFavorites="addFavorites" @searchInTab="searchInTab" @downloadCsv="downloadCsv" :date="date" :searchinput="search" :accounts="accounts" :idAccount="idAccount" :nbElement="filter.length"></Header>
        <Favorites @removeFavorite="removeFavorite" v-if="favorites != ''" class="container favorites-cp mb-5" @searchInTab="searchInTab" :favorites="favorites"></Favorites>
        <PlageHoraire :options="optionsPlageHoraire" @searchWithHoraire="searchWithHoraire" :custominterval="custom_interval" :startDate="startDate" :endDate="currentDate" :limitStart="limitStart" :limitEnd="limitEnd"></PlageHoraire>
        <div class="container table-year">
            <Table @sortBy="sortBy" @pauseMonitor="pauseMonitor" @continueMonitor="continueMonitor" @displayRow="displayRow" :months="months" :data="filter" :average="average" :date="date" :search="search" :idAccount="idAccount" :custom_interval="custom_interval" :daysSelected="daysSelected" :hasSort="true" :hasDisplayRow="true" :hasAverage="true" :hasIndispoInfo="true" :processing="processing"></Table>
        </div>
        <nav class="navbar fixed-bottom navbar-expand-lg navbar-dark bg-dark">
            <a href="#" class="navbar-brand">Réal. Actigraph</a>
        </nav>
    </div>
</template>

<script>
import axios from 'axios'
import moment,{ duration } from 'moment'
import jsoncsv from 'json2csv'
import Header from '@/components/Header';
import Favorites from '@/components/Favorites';
import Table from '@/components/Table';
import PlageHoraire from '@/components/PlageHoraire';
import mixin from '@/mixins/mixins.js';

export default {
    name : 'Result',
    mixins:[mixin],
    components: {
      Header, Table, PlageHoraire, Favorites
    },
    data(){
        return{
            optionsHeader: {"hasSearch":true, "hasCsv":true, "hasCount":true, "hasDashboard":true, "hasAccount": true, "hasDate": true},
            optionsPlageHoraire: {"hasDate":true, "hasPlageHoraire": true, "hasDayToExclude":true},
            favorites: [],
            sortKey: '',
            csv : null,
            search : '',
            reverse: false,
            idAccount: '',
            daysSelected:[],
            accounts: process.env.Accounts, 
            processing:true,
            endDate: null
        };
    },
    mounted(){
        this.getFavorite();
    },
    created(){
        this.getData();
    },
    watch: {
        '$route': 'getData'
    },
    computed : {
        limitStart: {
            get:function(){
                let start;
                let year = moment().format('YYYY');
                if("year" in this.$route.params && parseInt(year) != this.$route.params.year)
                    start = moment(this.$route.params.year, 'YYYY').startOf('year').format('X');
                else 
                    start = moment(moment().format('X'), 'X').startOf('year').format('X');
                
                return start;
            },
        },
        limitEnd: {
            get:function(){
                let end = "";
                let year = moment().format('YYYY');
                if("year" in this.$route.params && parseInt(year) != this.$route.params.year)
                    end = moment(this.$route.params.year, 'YYYY').endOf('year').format('X');
                else 
                    end = moment().format('X');

                return end;
            },
        }
    },
    methods : {
        getFavorite: function(){
            let vm = this;
            let url = process.env.urlAPI+'favorites';
            vm.favorites = [];
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(function (response) {
                vm.favorites = response.data;
            });
        },
        getData: async function(){
            let vm = this;
            vm.getRange();
            vm.getMonth();
            vm.results = await vm.getUptimeData();
            vm.filter = vm.results;
            vm.getMoyenne("result");
            if(vm.search != ""){
                vm.searchInTab(vm.search);
            } else { 
                if(typeof vm.$route.params.search !== "undefined")
                    if(vm.$route.params.search != "")
                        vm.searchInTab(vm.$route.params.search);
            }
        },
        getUptimeData: async function(){
            let vm = this;
            vm.processing = true;
            let currentDate;
            let year = moment().format('YYYY');
            if("year" in this.$route.params && parseInt(year) != this.$route.params.year)
                this.currentDate = moment(this.$route.params.year, 'YYYY').endOf('year').format('X');

            let startYear = moment(this.currentDate, 'X').startOf('year').format('X');
            
            if(this.$route.params.id !== undefined){
                vm.idAccount = this.$route.params.id;
            } else {
                vm.idAccount = '0';
            }

            let account = vm.accounts[vm.idAccount]["key"][0];
            if(this.$route.params.interval !== undefined) {
                this.custom_interval = this.$route.params.interval;
                this.$route.params.interval = undefined;
            } 
            if(this.$route.params.daysSelected !== undefined) {
                this.daysSelected = this.$route.params.daysSelected;
                this.$route.params.daysSelected = undefined;
            }
            if(vm.custom_interval[0] === "0" && vm.custom_interval[1] === "0")
              vm.custom_interval[1] = "86400";  

            let data = {
                "account":account,
                "ranges":vm.range,
                "custom_interval":vm.custom_interval,
                "custom_days_range":vm.daysSelected
            };
            if(vm.custom_interval[0] === "0" && vm.custom_interval[1] === "86400"){
                data = {
                    "account":account,
                    "ranges":vm.range
                };
            }
            if(vm.daysSelected.length > 0)
                data["custom_days_range"] = vm.daysSelected;
            
            let url = process.env.urlAPI+'siteslogs';
            let results =  await vm.getUptimeRequest(data, url);

            return results;
        },
        searchWithHoraire: function(interval, days, start, currentDate){
            this.custom_interval = interval;
            this.daysSelected = days;
            this.currentStartDate = start;
            this.currentDate = currentDate;
            this.getData();
        },
        downloadCsv: function(e){
            var json = Array()
            for(var i in this.filter){
                if(this.filter[i].isVisible)
                    json.push({
                        "Nom":this.filter[i].name,
                        "Disponibilité globale":(typeof this.filter[i].ranges[0] !== "undefined" ?  (this.filter[i].ranges[0]).toString().replace(".", ",") : ""),
                        "Janvier":(typeof this.filter[i].ranges[1] !== "undefined" ?  (this.filter[i].ranges[1]).toString().replace(".", ",") : ""),
                        "Février":(typeof this.filter[i].ranges[2] !== "undefined" ?  (this.filter[i].ranges[2]).toString().replace(".", ",") : ""),
                        "Mars":(typeof this.filter[i].ranges[3] !== "undefined" ?  (this.filter[i].ranges[3]).toString().replace(".", ",") : ""),
                        "Avril":(typeof this.filter[i].ranges[4] !== "undefined" ?  (this.filter[i].ranges[4]).toString().replace(".", ",") : ""),
                        "Mai":(typeof this.filter[i].ranges[5] !== "undefined" ?  (this.filter[i].ranges[5]).toString().replace(".", ",") : ""),
                        "Juin":(typeof this.filter[i].ranges[6] !== "undefined" ?  (this.filter[i].ranges[6]).toString().replace(".", ",") : ""),
                        "Juillet":(typeof this.filter[i].ranges[7] !== "undefined" ?  (this.filter[i].ranges[7]).toString().replace(".", ",") : ""),
                        "Août":(typeof this.filter[i].ranges[8] !== "undefined" ?  (this.filter[i].ranges[8]).toString().replace(".", ",") : ""),
                        "Septembre":(typeof this.filter[i].ranges[9] !== "undefined" ?  (this.filter[i].ranges[9]).toString().replace(".", ",") : ""),
                        "Octobre":(typeof this.filter[i].ranges[10] !== "undefined" ?  (this.filter[i].ranges[10]).toString().replace(".", ",") : ""),
                        "Novembre":(typeof this.filter[i].ranges[11] !== "undefined" ?  (this.filter[i].ranges[11]).toString().replace(".", ",") : ""),
                        "Décembre":(typeof this.filter[i].ranges[12] !== "undefined" ?  (this.filter[i].ranges[12]).toString().replace(".", ",") : ""),
                        "Plus longue indisponibilté":this.filter[i].longerLogDown[0].date,
                        "Durée":this.filter[i].longerLogDown[0].duration,
                        "Durée en seconde":this.filter[i].longerLogDown[0].timestamp,
                        "Cumul":this.filter[i].cumul,
                        "URL":(typeof this.filter[i].url !== "undefined" ?  (this.filter[i].url).toString().replace("#", "") : "")
                    });
            }
            var csv = jsoncsv({data : json, del : ";"});
            var hiddenElement = document.createElement('a');
            document.body.appendChild(hiddenElement);
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            
            if(this.search != "")
                hiddenElement.download = 'uptime_robot_synthese_'+this.search+'.csv';
            else 
                hiddenElement.download = 'uptime_robot_synthese.csv';

            hiddenElement.click();
        },
        sortBy: function(name){
            var vm = this;
            var sortby = "";

            if(Number.isInteger(name))
                sortby = "[\'ranges\']["+name+"]";
            else 
                sortby = name;
            
            if (vm.sortKey === sortby) {
                vm.reverse = !vm.reverse;
            } else {
                vm.reverse = true;
                vm.sortKey = sortby;
            }
            var ascending = vm.reverse;
            vm.filter.sort(function(a, b) {
                if(Number.isInteger(name)){
                    var valueA, valueB = null;          
                    valueA = a["ranges"][name];
                    valueB = b["ranges"][name];
                    if (valueA > valueB) {
                        return ascending ? 1 : -1;
                    } else if (valueA < valueB) {
                        return ascending ? -1 : 1;
                    }
                } else {
                    if(sortby == "name"){
                        if (a[sortby].toUpperCase() > b[sortby].toUpperCase()) {
                            return ascending ? 1 : -1;
                        } else if (a[sortby].toUpperCase() < b[sortby].toUpperCase()) {
                            return ascending ? -1 : 1;
                        }
                    }else{ 
                        if (a[sortby] > b[sortby]) {
                            return ascending ? 1 : -1;
                        } else if (a[sortby] < b[sortby]) {
                            return ascending ? -1 : 1;
                        }
                    }
                }
                
                return 0;
            })
        },
        displayRow: function(index){
            var vm = this;
            vm.filter[index]["isVisible"]= !vm.filter[index]["isVisible"];
            vm.getMoyenne("result");
        },
        searchInTab: function(value){
            var vm = this;

            var result = vm.results.filter(element => this.removeAccent(element.name.toUpperCase()).includes(this.removeAccent(value.toUpperCase())) || this.removeAccent(element.url.toUpperCase()).includes(this.removeAccent(value.toUpperCase())));
            vm.filter = result;
            vm.searchValue = value;
            vm.search = value;
            vm.getMoyenne("result");
        },
        removeFavorite : function(val){
            let vm = this
            var value = this.favorites.find(e => e._id === val)
            var index = this.favorites.indexOf(value);
            if (index > -1) {
                let data = {"id":val};
                let url = process.env.urlAPI+'favorites';
                axios.delete(url, {data: data}, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(function (response) {
                    vm.favorites.splice(index, 1);
                });
            }
        },
        addFavorites : function(val){
            let vm = this
            let data = {"name":val};
            let url = process.env.urlAPI+'favorites';
            axios.post(url, data, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(function (response) {
                vm.favorites.push(response.data)
            });
        },
        pauseMonitor: function(id){
            let vm = this;
            let url = process.env.urlAPI+'pauseSite';
            let siteConcerned = vm.filter.find(e => e.id === id);
            axios.post(url, {id:id}, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(function (resp) {
                if(resp.data.success === 1)
                    siteConcerned.status = 0;
                
            });
        },
        continueMonitor: function(id){
            let vm = this;
            let url = process.env.urlAPI+'continueSite';
            let siteConcerned = vm.filter.find(e => e.id === id);
            siteConcerned.status = 0;
            
            axios.post(url, {id:id}, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(function (resp) {
                if(resp.data.success === 1)
                    siteConcerned.status = 2;
            });
        },
        removeAccent : function(val){
            val = val.replace(/[ÁÀÄÂ]/g, "A");
            val = val.replace(/[ÉÈËÊ]/g, "E");
            val = val.replace(/[ÍÌÏÎ]/g, "I");
            val = val.replace(/[ÓÒÖÔ]/g, "O");
            val = val.replace(/[ÚÙÜÛ]/g, "U");

            return val;
        }
    },
}

</script>
<style>

.MoyenneHeaders {
    line-height: 2%;
}

.MoyenneHeaders th{
    font-size: 12px
}

table thead th {
    border-bottom: 0 !important;
    height: 10px !important;
}

.not-visible * {
    opacity: 0.4;
    filter: alpha(opacity=80)
}
.favorites-cp {
    width: 90%;
    padding-right: 0px;
    padding-left: 0px;
    margin-right: auto;
    margin-left: auto;
}
</style>



