<template>
    <div>
        <Header :options="optionsHeader" :date="date"></Header>
        <div class="container" v-if="details != ''">
            <div class="card border-primary card-background">
                <div class="Detail"  v-for="detail in details " :key="detail.id" >
                    <div class="col-lg-12">
                        <div class="row entete card-header">
                            <div class="col-md-12">
                                <div class="title">
                                    <h1  v-if="filter != ''" class="text-center">{{detail.name}} : Disponibilité globale :
                                        <small v-if="filter[0].ranges[0] == 0.000">nc</small>
                                        <small class="p-3 mb-2 bg-success" v-if="filter[0].ranges[0] > 99.9 || filter[0].ranges[0] == 100.000">{{filter[0].ranges[0] | formatNumber}} % </small>
                                        <small class="p-3 mb-2 bg-warning" v-else-if="filter[0].ranges[0] >99.6">{{filter[0].ranges[0] | formatNumber}} %</small>
                                        <small class="p-3 mb-2 bg-danger" v-else-if="filter[0].ranges[0] <99.6">{{filter[0].ranges[0] | formatNumber}} %</small>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="table-year">
                                    <Table :months="months" :data="filter" :average="[]" :keyAccount="$route.params.key" :date="date" :search="''" :idAccount="$route.params.idAccount" :custom_interval="$route.params.interval" :daysSelected="$route.params.daysSelected" :hasSort="false" :hasDisplayRow="false" :hasAverage="false" :hasSearch="false" :hasIndispoInfo="false"></Table>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="card border-primary">
                                    <div class="card-header">
                                        <div class="col-xs-9 text-center">
                                            <strong>Disponibilité sur les 4 dernières semaines en %</strong>
                                        </div>
                                    </div>
                                    <div class="card-body text-center">
                                        <div class="row">
                                            <div class="col-lg-3 text-center">
                                                <p class="dateranges">
                                                    <strong>{{jours[0]}}</strong>
                                                </p>
                                                <div class="progress">
                                                <div v-if="detail.ranges[3] > '99,9' || detail.ranges[3] == '100,000'" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[3] + '%'}"  v-bind:aria-valuenow="detail.ranges[3]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[3]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[3] >'99,6'" class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[3] + '%'}"  v-bind:aria-valuenow="detail.ranges[3]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[3]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[3] <'99,6'" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[3] + '%'}"  v-bind:aria-valuenow="detail.ranges[3]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[3]}} %</strong></div>
                                                </div>
                                            </div>
                                            <div class="col-lg-3 text-center">
                                                <p class="dateranges">
                                                    <strong>{{jours[1]}}</strong>
                                                </p>
                                                <div class="progress">
                                                <div v-if="detail.ranges[2] > '99,9' || detail.ranges[2] == '100,000'" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[2] + '%'}"  v-bind:aria-valuenow="detail.ranges[2]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[2]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[2] >'99,6'" class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[2] + '%'}"  v-bind:aria-valuenow="detail.ranges[2]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[2]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[2] <'99,6'" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[2] + '%'}"  v-bind:aria-valuenow="detail.ranges[2]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[2]}} %</strong></div>
                                                </div>
                                            </div>
                                            <div class="col-lg-3 text-center">
                                                <p class="dateranges">
                                                    <strong>{{jours[2]}}</strong>
                                                </p>
                                                <div class="progress">
                                                <div v-if="detail.ranges[1] > '99,9' || detail.ranges[1] == '100,000'" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[1] + '%'}"  v-bind:aria-valuenow="detail.ranges[1]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[1]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[1] >'99,6'" class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[1] + '%'}"  v-bind:aria-valuenow="detail.ranges[1]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[1]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[1] <'99,6'" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[1] + '%'}"  v-bind:aria-valuenow="detail.ranges[1]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[1]}} %</strong></div>
                                                </div>
                                            </div>
                                            <div class="col-lg-3 text-center">
                                                <p class="dateranges">
                                                    <strong>{{jours[3]}}</strong>
                                                </p>
                                                <div class="progress">
                                                <div v-if="detail.ranges[0] > '99,9' || detail.ranges[0] == '100,000'" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[0] + '%'}"  v-bind:aria-valuenow="detail.ranges[0]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[0]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[0] >'99,6'" class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[0] + '%'}"  v-bind:aria-valuenow="detail.ranges[0]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[0]}} %</strong></div>
                                                <div  v-else-if="detail.ranges[0] <'99,6'" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{'width':detail.rangesW[0] + '%'}"  v-bind:aria-valuenow="detail.ranges[0]" aria-valuemin="0" aria-valuemax="100"><strong>{{detail.ranges[0]}} %</strong></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="container-fluid" v-if="filter != ''">
                                <div v-if="allLogs == 'empty'" class="p-3 mb-2 bg-success text-white text-center"><h2>0 indisponibilité</h2></div>
                                <div v-else-if="filter[0].ranges[0] > 99.9 || filter[0].ranges[0] == 100.000" class="p-3 mb-2 bg-success text-white text-center"><h2>{{allLogs.length}} indisponibilités - {{filter[0].cumul}}</h2></div>
                                <div v-else-if="filter[0].ranges[0] >99.6" class="p-3 mb-2 bg-warning text-white text-center"><h2>{{allLogs.length}} indisponibilités - {{filter[0].cumul}}</h2></div>
                                <div v-else-if="filter[0].ranges[0] <99.6" class="p-3 mb-2 bg-danger text-white text-center"><h2>{{allLogs.length}} indisponibilités - {{filter[0].cumul}}</h2></div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="card border-primary" v-if="filter != ''">
                                    <div class="card-header">
                                        <div v-for="logs in filter[0].longerLogDown" :key="logs.id" class="col-xs-9 text-center">
                                            <strong v-if="logs.date == '0'">Aucune indisponibilité</strong>
                                            <strong v-else>Plus longue indisponibilité : {{logs.date}} à {{logs.hour}} pendant {{logs.duration}} / {{logs.reason.detail}}</strong>
                                        </div>
                                    </div>
                                    <div class="card-body text-center lastlogs">
                                        <div v-if="filter[0].logs == 'empty'">
                                            <p>Aucune</p>
                                        </div>
                                        <div v-else>
                                            <table class="table table-hover table-striped table-fixed table-sm" id="tableLogs">
                                                <thead>
                                                    <th>Date</th>
                                                    <th>Heure</th>
                                                    <th>Raison</th>
                                                    <th>Durée</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="logs in filter[0].logs " :key="logs.id">
                                                        <td :id="logs.datetime">
                                                            {{logs.date}}
                                                        </td>
                                                        <td :id="logs.datetime">
                                                            {{logs.hour}}
                                                        </td>
                                                        <td :id="logs.datetime">
                                                            {{logs.reason.code}} - {{logs.reason.detail}}
                                                        </td>
                                                        <td :id="logs.timestamp">
                                                            {{logs.duration}}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tbody v-if="filter == ''">
                                                    <tr>
                                                        <td colspan="12">
                                                            <div class="d-flex justify-content-center">
                                                                <div class="spinner-border" role="status">
                                                                    <span class="sr-only">Loading...</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card border-primary" v-if="filter != ''">
                                    <div class="card-header">
                                        <div class="col-xs-9 text-center">
                                            <strong >SSL Informations</strong>
                                        </div>
                                    </div>
                                    <div class="card-body text-center">
                                        <table class="table table-hover table-striped table-fixed table-sm" id="tableLogs">
                                            <tbody>
                                                <tr>
                                                    <td>Etat</td>
                                                    <td v-if="filter[0].ssl.ssl_monitored == true"><p class="success">Actif</p></td>
                                                    <td v-if="filter[0].ssl.ssl_monitored == false"><p class="danger">Inactif</p></td>
                                                </tr>
                                                <tr>
                                                    <td>Emetteur</td><td>{{filter[0].ssl.ssl_issuer}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Sujet</td><td>{{filter[0].ssl.ssl_subject}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Algo</td><td>{{filter[0].ssl.ssl_algo}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Date expiration</td>
                                                    <td v-if="filter[0].ssl.ssl_expireDatetime-currenttimestamp > 7"><p class="success">{{filter[0].ssl.ssl_expireDatetime | convertTimestampInDateAndHour}}</p></td>
                                                    <td v-if="filter[0].ssl.ssl_expireDatetime-currenttimestamp <= 7"><p class="danger">{{filter[0].ssl.ssl_expireDatetime | convertTimestampInDateAndHour}}</p></td>
                                                </tr>
                                                <tr>
                                                    <td>Erreur</td>
                                                    <td>{{filter[0].ssl.ssl_error}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card border-primary" v-if="filter != ''">
                                    <div class="card-header">
                                        <div class="col-xs-9 text-center">
                                            <strong>Lighthouse Informations</strong>
                                        </div>
                                    </div>
                                    <div class="card-body text-center">
                                        <table class="table table-hover table-striped table-fixed table-sm" id="tableLogs">
                                            <tbody>
                                                <tr>
                                                    <td>Performance</td>
                                                    <td v-if="filter[0].lighthouse.lighthouse_performance >= 90"><p class="success">{{filter[0].lighthouse.lighthouse_performance}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_performance >= 50 && filter[0].lighthouse.lighthouse_performance < 90"><p class="alert">{{filter[0].lighthouse.lighthouse_performance}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_performance < 50"><p class="danger">{{filter[0].lighthouse.lighthouse_performance}}</p></td>
                                                </tr>
                                                <tr>
                                                    <td>Accessibility</td>
                                                    <td v-if="filter[0].lighthouse.lighthouse_accessibility >= 90"><p class="success">{{filter[0].lighthouse.lighthouse_accessibility}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_accessibility >= 50 && filter[0].lighthouse.lighthouse_accessibility < 90"><p class="alert">{{filter[0].lighthouse.lighthouse_accessibility}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_accessibility < 50"><p class="danger">{{filter[0].lighthouse.lighthouse_accessibility}}</p></td>
                                                </tr>
                                                <tr>
                                                    <td>Best practices</td>
                                                    <td v-if="filter[0].lighthouse.lighthouse_bestPractices >= 90" class="bg-success"><p class="success">{{filter[0].lighthouse.lighthouse_bestPractices}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_bestPractices >= 50 && filter[0].lighthouse.lighthouse_bestPractices < 90"><p class="alert">{{filter[0].lighthouse.lighthouse_bestPractices}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_bestPractices < 50"><p class="danger">{{filter[0].lighthouse.lighthouse_bestPractices}}</p></td>
                                                </tr>
                                                <tr>
                                                    <td>SE0</td>
                                                    <td v-if="filter[0].lighthouse.lighthouse_seo >= 90"><p class="success">{{filter[0].lighthouse.lighthouse_seo}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_seo >=50 && filter[0].lighthouse.lighthouse_seo < 90"><p class="alert">{{filter[0].lighthouse.lighthouse_seo}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_seo < 50"><p class="danger">{{filter[0].lighthouse.lighthouse_seo}}</p></td>
                                                </tr>
                                                <tr>
                                                    <td>PWA</td>
                                                    <td v-if="filter[0].lighthouse.lighthouse_pwa >= 90"><p class="success">{{filter[0].lighthouse.lighthouse_pwa}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_pwa >= 50 && filter[0].lighthouse.lighthouse_pwa < 90"><p class="alert">{{filter[0].lighthouse.lighthouse_pwa}}</p></td>
                                                    <td v-else-if="filter[0].lighthouse.lighthouse_pwa < 50"><p class="danger">{{filter[0].lighthouse.lighthouse_pwa}}</p></td>
                                                </tr>
                                                <tr>
                                                    <td>Date</td><td>{{filter[0].lighthouse.lighthouse_dateTime | convertTimestampInDate}}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="12"><a class="btn btn-outline-primary" target="_blank" :href="filter[0].lighthouse.lighthouse_url" role="button">Plus de détails</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="card border-primary" v-if="filter != ''">
                                    <div class="card-header">
                                        <div class="col-xs-9 text-center">
                                            <strong>Capture d'écran au {{filter[0].screenshot.screenshot_dateTime | convertTimestampInDate}}</strong>
                                        </div>
                                    </div>
                                    <div class="card-body text-center">
                                        <img :src="filter[0].screenshot.screenshot_url" class="img-fluid" alt="Screen shot website">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Header from '@/components/Header';
import Table from '@/components/Table';
import mixin from '@/mixins/mixins.js';

export default {
    mixins:[mixin],
    components: {
        Header, Table
    },
    data(){
        return{
            optionsHeader: {"hasSearch":false, "hasCsv":false, "hasCount":false, "hasDashboard":false, "hasAccount": false, "hasDate": false},
            details : [],
            jours : [],
            hasSearch : false,
            date: null,
            currenttimestamp:moment().format('X')
        };
    },
    computed: {
        weekRange :{
            get : function(){
                let currentDate = moment().format('X');
                let startYear = moment(currentDate, 'X').startOf('year').format('X');
                let yearRange = ""+startYear+"_"+currentDate+"";

                let startFirstWeek = parseInt(moment(currentDate, 'X').startOf('week').format('X'))+86400;
                let endFirstWeek = parseInt(moment(currentDate, 'X').endOf('week').format('X'))+86401;
                let firstWeek = ""+startFirstWeek+"_"+currentDate+"";
                let week1 = "Du "+moment(startFirstWeek, 'X').locale('fr').format('L')+" à Aujourd'hui";
                let secondWeek = ""+(startFirstWeek-604800)+"_"+(endFirstWeek-604800)+"";
                let week2 = "Du "+moment((startFirstWeek-604800), 'X').locale('fr').format('L')+" au "+moment((endFirstWeek-604800), 'X').locale('fr').format('L');
                let thirdWeek = ""+(startFirstWeek-604800*2)+"_"+(endFirstWeek-604800*2)+"";
                let week3 = "Du "+moment((startFirstWeek-604800*2), 'X').locale('fr').format('L')+" au "+moment((endFirstWeek-604800*2), 'X').locale('fr').format('L');
                let fourthWeek = ""+(startFirstWeek-604800*3)+"_"+(endFirstWeek-604800*3)+"";
                let week4 = "Du "+moment((startFirstWeek-604800*3), 'X').locale('fr').format('L')+" au "+moment((endFirstWeek-604800*3), 'X').locale('fr').format('L');

                this.jours = [week4, week3, week2, week1];

                let weekRange = yearRange+"-"+fourthWeek+"-"+thirdWeek+"-"+secondWeek+"-"+firstWeek;
                return weekRange;
            }
        }
    },
    filters: {
        formatNumber (value) {
            var number = value.toFixed(3);
            return number.toString().replace('.', ',');
        },
        convertTimestampInDate (value) {
            return moment(value, 'X').locale('fr').format('L');
        },
        convertTimestampInDateAndHour (value) {
            return moment(value, 'X').locale('fr').format('L HH:mm:ss');
        }
    },
    created(){
        this.getData();
    },
    watch: {
        '$route': 'getData'
    },
    methods : {
        getData: async function(){
            let vm = this;
            vm.getRange();
            vm.getMonth();
            vm.filter = await vm.getUptimeData();
            await vm.getDataUptimeWeek();
        },
        getUptimeData: async function(){
            let vm = this;
            let data = {
                "site":[this.$route.params.id],
                "ranges":vm.range,
                "custom_interval":vm.$route.params.interval,
                "custom_days_range":vm.$route.params.daysSelected
            };
            if(vm.$route.params.interval === undefined){
                data = {
                    "site":[this.$route.params.id],
                    "ranges":this.range,
                };
            } else {
               if(vm.$route.params.interval[0] === '0' && vm.$route.params.interval[1] === '86400'){
                    data = {
                        "site":[this.$route.params.id],
                        "ranges":vm.range,
                    };
                }
            }
            let url = process.env.urlAPI+'siteslogs';
            let results =  await vm.getUptimeRequest(data, url);
            console.log(results);
            return results;
        },
        getDataUptimeWeek: async function(){
            let vm = this;
            let currentDate = moment().format('X');
            let startYear = moment(currentDate, 'X').startOf('year').format('X');
            var results = [];
            let data = {
                "site":[vm.$route.params.id],
                "ranges":this.weekRange,
                "custom_interval":vm.$route.params.interval,
                "custom_days_range":vm.$route.params.daysSelected
            }
            let detail = Array();
            let url = process.env.urlAPI+'siteslogs';
            axios.post(url, data).
            then(function (response) {
                for(var i in response.data){
                    let logDown;
                    let longerLogDown = vm.searchForLongerLog(response.data[i].logs, 1);
                    let ranges = ((response.data[i].custom_uptime_ranges.replace(/\./g, ',')).split('-')).reverse();
                    let rangeW = ((response.data[i].custom_uptime_ranges).split('-')).reverse();

                    results.push({
                        "name":response.data[i].friendly_name,
                        "status":response.data[i].status,
                        "ranges":ranges,
                        "rangesW":rangeW,
                        "longerLogDown":longerLogDown,
                        "url":"",
                        "createdDate": moment(response.data[i].creation_datetime, 'X').locale('fr').format('Do MMMM YYYY, HH:mm:ss')

                    })
                }
            })
            vm.details = results;
        },
        searchForLongerLog : function (log, mode){
            let date = 0;
            let hour = 0;
            let duration = 0;
            let reason;
            let logs = Array();
            let logsDown = Array();
            let maxLogDown = Array();
            for(var i in log){
                if(log[i].type == 1){
                    logs.push(log[i]);
                }
            }
            for (var i in logs){
                logsDown.push({"date": moment(logs[i].datetime, 'X').locale('fr').format('L'),"datetime":logs[i].datetime, "hour": moment(logs[i].datetime, 'X').locale('fr').format('HH:mm:ss'), "reason":logs[i].reason, "duration":this.convertSecondIntoTime(logs[i].duration), "timestamp":logs[i].duration});
                if (logs[i].duration>duration){
                    date = moment(logs[i].datetime, 'X').locale('fr').format('dddd L');
                    hour = moment(logs[i].datetime, 'X').locale('fr').format('HH:mm:ss');
                    duration = logs[i].duration;
                    reason = logs[i].reason;
                }
            }

            maxLogDown.push({"date":date, "hour":hour, "reason":reason,  "duration":this.convertSecondIntoTime(duration), "timestamp":duration});
            if(mode == 1)
                return maxLogDown;
            else
                return logsDown;
        },
        convertSecondIntoTime : function (second){
            let time = 0;
            let days = moment.duration(second, 'seconds').days();
            let hours = moment.duration(second, 'seconds').hours();
            let minutes = moment.duration(second, 'seconds').minutes();
            let seconds = moment.duration(second, 'seconds').seconds();

            if(days == "0" && hours == "0" && minutes == "0" )
                time = seconds+"s";
            else if(days == "0" && hours == "0")
                time = minutes+"m"+seconds+"s";
            else if(days == "0")
                time = hours+"h"+minutes+"m"+seconds+"s";
            else
                time = days+"j"+hours+"h"+minutes+"m"+seconds+"s";

            return time
        }
    }
}
</script>

<style>
.lastlogs {
    max-height: none !important;
}
</style>

