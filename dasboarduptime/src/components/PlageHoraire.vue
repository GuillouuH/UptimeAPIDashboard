<template>
    <div class="plage">
        <div id="accordion" class="container bg-dark">
            <div class="card">
                <div class="card-header d-flex flex-row-reverse">
                    <a class="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
                        Gestion des dates et heures
                        <span class="fas fa-angle-double-down" aria-hidden="true"></span>
                    </a>
                </div>
                <div id="collapseTwo" class="collapse" data-parent="#accordion">
                    <div class="m-4" v-if="options.hasDate">
                        <div class="card">
                            <div class="card-header">
                                Dates
                            </div>
                            <div class="card-body">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputEmail4">Entre</label>
                                        <datepicker v-model="dateDebut" :value="dateDebut" :disabled-dates="disabledDates" bootstrap-styling full-month-name :language="fr"></datepicker>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputPassword4">Et</label>
                                        <datepicker v-model="dateFin" :value="dateFin" :disabled-dates="disabledDates" bootstrap-styling full-month-name :language="fr"> </datepicker>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m-4" v-if="options.hasPlageHoraire">
                        <div class="card">
                            <div class="card-header">
                                Plages horaires
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <span class="col-md-2 align-middle text-form">Entre</span>
                                    <div class="form-row col-md-4">  
                                        <div class="col-md-6 mb-3">
                                            <label for="Heure1">Heures</label>
                                            <select class="form-control" id="Heure1" v-model="firstHour">
                                                <option v-for="(item, index) in hours" :key="index" :val="item" :selected="item.val===firstHour">{{item}}</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="Minute1">Minutes</label>
                                            <select class="form-control" id="Minute1" v-model="firstMinute">
                                                <option v-for="item in minutes" :key="item.id" :val="item" :selected="item.val===firstMinute">{{item}}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <span class="col-md-2 align-middle text-form">Et</span>
                                    <div class="form-row col-md-4">  
                                        <div class="col-md-6 mb-3">
                                            <label for="Heure2">Heures</label>
                                            <select class="form-control" id="Heure1" v-model="secondHour">
                                                <option v-for="item in hours" :key="item.id"  :val="item" :selected="item.val===secondHour">{{item}}</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="Minute2">Minutes</label>
                                            <select class="form-control" id="Minute2" v-model="secondMinute">
                                                <option v-for="item in minutes" :key="item.id"  :val="item" :selected="item.val===secondMinute">{{item}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m-4" v-if="options.hasDayToExclude">
                        <div class="card">
                            <div class="card-header">
                                Jours à exclure
                            </div>
                            <div class="card-body">
                                <div v-for="item in days" :val="item.val" :key="item.id"  class="form-check form-check-inline w-auto">
                                    <input class="form-check-input" type="checkbox" :id="item.val" :value="item.val" v-model="daysSelected">
                                    <label class="form-check-label" :for="item.val">{{item.name}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m-4">
                        <button type="button" class="btn btn-primary btn-lg btn-block" @click.prevent="searchWithHoraire">Valider</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Datepicker from 'vuejs-datepicker';
import {es,fr} from 'vuejs-datepicker/dist/locale'

export default {
    name: 'PlageHoraire',
    props: ['custominterval', 'startDate', 'endDate', 'limitStart', 'limitEnd', 'options'],
    components: {
        Datepicker
    },
    data(){
        return{
            fr:fr,
            firstHour:'00',
            firstMinute:'00',
            secondHour:'00',
            secondMinute:'00',
            interval:'',
            daysSelected: [],
            days: [{name:"Lundi", val:"monday"}, {name:"Mardi", val:"tuesday"},{name:"Mercredi", val:"wednesday"},{name:"Jeudi", val:"thursday"},{name:"Vendredi", val:"friday"},{name:"Samedi", val:"saturday"},{name:"Dimanche", val:"sunday"}],
            hours: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            dateDebut: null,
            dateFin: null
        }
    },
    created(){
        this.convertInterval()
    },
    watch: {
        '$route': 'convertInterval'
    },
    computed: {
        disabledDates :{
            get: function(){
                let disabledDatesObject = {
                    to : new Date(this.limitStart * 1000),
                    from: new Date(this.limitEnd * 1000)
                };
                this.dateDebut = disabledDatesObject.to;
                this.dateFin = disabledDatesObject.from;

                return disabledDatesObject;
            }
        },
        minutes :{
            get : function(){
                let arrayMinutes = [];
                for(var i = 0; i<60; i++){
                    if(i < 10){
                        arrayMinutes.push(('0' + i).slice(-2));
                    } else {
                        arrayMinutes.push(i.toString());
                    }
                }

                return arrayMinutes;
            }
        }
    },
    methods: {
        searchWithHoraire: function(){
            let vm = this;
            let firstHour = parseInt(this.firstHour)*3600 + parseInt(this.firstMinute) * 60;
            let secondHour = parseInt(this.secondHour)*3600 + parseInt(this.secondMinute) * 60;
            this.interval = [firstHour.toString(), secondHour.toString()];
            vm.$emit('searchWithHoraire', this.interval, this.daysSelected, this.dateDebut/1000, this.dateFin/1000);
        },
        convertInterval(){
            for (var key in this.custominterval) {
                if (this.custominterval.hasOwnProperty(key)) {
                    let d = Number(this.custominterval[key]);
                    var h = Math.floor(d / 3600);
                    if(h < 10)
                        h = ('0' + Math.floor(d / 3600)).slice(-2);
                    var m = Math.floor(d % 3600 / 60)
                    if(m < 10)
                        m = ('0' + Math.floor(d % 3600 / 60)).slice(-2);

                    if(h === 24){
                        h = "00"
                        m = "00"
                    };
                    if(key === "0") {
                        this.firstHour = h.toString();
                        this.firstMinute = m.toString();
                    } else {
                        this.secondHour = h.toString();
                        this.secondMinute = m.toString();
                    }
                }
            }
        },
    }
}
</script>

<style>
#accordion {
    width: 90%;
    padding-right: 0px;
    padding-left: 0px;
    margin-right: auto;
    margin-left: auto;
}
.card-link {
    color: #fff;
}
.text-form {
    display: flex; 
    align-items: center;  
    justify-content: center;
}

</style>