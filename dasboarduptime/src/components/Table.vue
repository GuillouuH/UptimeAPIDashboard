<template>
    <div class="table">
        <div class="table-responsive">
            <table class="table-fixed table table-hover table-striped table-lg" id="data">
                <thead class="table-header">
                    <tr>
                        <th scope="col" @click.prevent="sortBy('name')">Nom</th>
                        <th scope="col" @click.prevent="sortBy(0)">Dispo. globale</th>
                        <th scope="col" v-for="(month, index) in months" :key="month.id" @click.prevent="sortBy(index+1)">{{month}}</th>
                        <template v-if="hasIndispoInfo">
                            <th scope="col" @click.prevent="sortBy('timestampLogdown')">Plus longue indispo</th>
                            <th scope="col" @click.prevent="sortBy('cumulSeconde')">Cumulé <br> Nb indispo</th>
                            <th scope="col"></th>
                        </template>
                        <template v-if="hasSort === true">
                            <th scope="col"></th>
                        </template>
                    </tr>
                    <template v-if="data != ''">
                        <tr v-if="hasAverage == true" class="MoyenneHeaders" >
                            <th v-for="average in average" :key="average.id">{{average}}</th>
                        </tr>
                    </template>
                </thead>
                <tbody v-if="processing">
                    <tr>
                        <td :colspan='colspan'>
                            <div class="d-flex justify-content-center">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else-if="data.length > 0 &&  !processing" id="results">
                    <tr v-for="(result, index) in data" :key="index" @dblclick="displayRow(index)" :class="{'not-visible':!result.isVisible}">
                        <td scope="row" class="name text-left">
                            <p v-if="result.status==0" class="secondary text-left">
                                <span v-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp > 604800 && result.ssl.ssl_error == ''" class="fa fa-lock" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp <= 604800 && result.ssl.ssl_error == ''" class="fa fa-lock alert-ssl" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="(result.ssl.ssl_monitored == true && (result.ssl.ssl_expireDatetime < currenttimestamp || result.ssl.ssl_error != ''))" class="fa fa-lock-open not-ssl"></span>
                                <span v-if="result.status==2" class="fa fa-check-circle" aria-hidden="true"></span>
                                <strong><router-link :to="{name:'Details',
                                    params:{
                                        id:result.id,
                                        from:$route,
                                        key:keyAccount,
                                        year:date,
                                        date:date,
                                        search:search,
                                        idAccount:idAccount,
                                        interval:custom_interval,
                                        daysSelected:daysSelected
                                    }
                                }">
                                <span class="libellename">{{result.name}}</span><span class="far fa-chart-bar pt-1 float-right" aria-hidden="true"></span></router-link></strong>
                            </p>
                            <p v-if="result.status==2" class="success text-left">
                                <span v-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp > 604800 && result.ssl.ssl_error == ''" class="fa fa-lock" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp <= 604800 && result.ssl.ssl_error == ''" class="fa fa-lock alert-ssl" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="(result.ssl.ssl_monitored == true && (result.ssl.ssl_expireDatetime < currenttimestamp || result.ssl.ssl_error != ''))" class="fa fa-lock-open not-ssl"></span>
                                <span v-if="result.status==2" class="fa fa-check-circle" aria-hidden="true"></span>
                                <strong><router-link :to="{name:'Details',
                                    params:{
                                        id:result.id,
                                        from:$route,
                                        key:keyAccount,
                                        date:date,
                                        year:date,
                                        search:search,
                                        idAccount:idAccount,
                                        interval:custom_interval,
                                        daysSelected:daysSelected
                                    }
                                }">
                                <span class="libellename">{{result.name}}</span><span class="far fa-chart-bar pt-1 float-right" aria-hidden="true"></span></router-link></strong>
                            </p>
                            <p v-if="result.status==9" class="alert text-left">
                                <span v-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp > 604800 && result.ssl.ssl_error == ''" class="fa fa-lock" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp <= 604800 && result.ssl.ssl_error == ''" class="fa fa-lock alert-ssl" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="(result.ssl.ssl_monitored == true && (result.ssl.ssl_expireDatetime < currenttimestamp || result.ssl.ssl_error != ''))" class="fa fa-lock-open not-ssl"></span>
                                <span v-if="result.status==9" class="fa fa-exclamation-circle" aria-hidden="true"></span>
                                <strong><router-link :to="{name:'Details',
                                    params:{
                                        id:result.id,
                                        from:$route,
                                        key:keyAccount,
                                        date:date,
                                        year:date,
                                        search:search,
                                        idAccount:idAccount,
                                        interval:custom_interval,
                                        daysSelected:daysSelected
                                    }
                                }">
                                <span class="libellename">{{result.name}}</span><span class="far fa-chart-bar pt-1 float-right" aria-hidden="true"></span></router-link></strong>
                            </p>
                            <p v-if="result.status==8" class="danger text-left">
                                <span v-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp > 604800 && result.ssl.ssl_error == ''" class="fa fa-lock" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="result.ssl.ssl_monitored == true && result.ssl.ssl_expireDatetime-currenttimestamp <= 604800 && result.ssl.ssl_error == ''" class="fa fa-lock alert-ssl" data-toggle="tooltip" data-placement="top" :title="result.ssl.ssl_expireDatetime | getmonthexpire"></span>
                                <span v-else-if="(result.ssl.ssl_monitored == true && (result.ssl.ssl_expireDatetime < currenttimestamp || result.ssl.ssl_error != ''))" class="fa fa-lock-open not-ssl"></span>
                                <span v-if="result.status==8" class="fa fa-times-circle" aria-hidden="true"></span>
                                <strong><router-link :to="{name:'Details',
                                    params:{
                                        id:result.id,
                                        from:$route,
                                        key:keyAccount,
                                        date:date,
                                        year:date,
                                        search:search,
                                        idAccount:idAccount,
                                        interval:custom_interval,
                                        daysSelected:daysSelected
                                    }
                                }">
                                <span class="libellename">{{result.name}}</span><span class="far fa-chart-bar pt-1 float-right" aria-hidden="true"></span></router-link></strong>
                            </p>
                        </td>
                        <td class="ranges" v-for="range in result.ranges " :key="range.id">
                            <p v-if="range == 0.000" class="secondary">nc</p>
                            <p v-else-if="range > 99.9 || range == 100.000" class="success">{{range | formatNumber}}</p>
                            <p v-else-if="range > 99.6" class="alert">{{range | formatNumber}}</p>
                            <p v-else-if="range < 99.6" class="danger">{{range | formatNumber}}</p>
                        </td>
                        <template v-if="hasIndispoInfo">
                            <td class="logdownDuration" v-for="logdown in result.longerLogDown " :key="logdown.id">
                                <p class="timestamp" hidden>{{logdown.timestamp}}</p>
                                {{logdown.duration}} <template v-if="logdown.date != 0"> - {{logdown.date}} </template>
                            </td>
                            <td class="">
                                {{result.cumul}} - {{result.logscount}}
                            </td>
                            <td class="actions text-right">
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <a tag="button" data-toggle="tooltip" data-placement="top" title="Voir le site"  class="btn btn-primary" target="_blank" :href="result.url"><span class="fas fa-external-link-alt" aria-hidden="true"></span></a>
                                </div>
                            </td>
                            <td>
                                <div class="switch-toggle alert alert-secondary mb-0">
                                    <input :id="'pause'+index" :name="'startpause'+index" type="radio" :data-id="result.id" :checked="result.status === 2 && canPauseAndStop === true" @click="continueMonitor">
                                    <label :for="'pause'+index"><i :class="{ 'text-white': result.status != 0 && canPauseAndStop === true, 'fas fa-play':true} " aria-hidden="true"></i></label>
                                    
                                    <input :id="'start'+index" :name="'startpause'+index" type="radio" :data-id="result.id" :checked="result.status === 0 && canPauseAndStop === true" @click="pauseMonitor">
                                    <label :for="'start'+index"><i :class="{ 'text-white': result.status === 0 && canPauseAndStop === true, 'fas fa-pause':true} " aria-hidden="true"></i></label>
                                    
                                    <a v-if="result.status === 0 && canPauseAndStop" class="btn btn-secondary"></a>
                                    <a v-if="result.status != 0 && canPauseAndStop" class="btn btn-success"></a>
                                </div>
                            </td>

                        </template>
                    </tr>
                </tbody>
                <tbody v-else-if="data.length === 0 && !processing" id="results">
                    <tr>
                        <td :colspan='colspan'>Aucun résultat</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>

</template>
<script>
import moment,{ duration } from 'moment'
export default {
    props: ['data', 'months', 'average', 'keyAccount', 'date', 'search', 'idAccount','custom_interval', 'daysSelected', 'hasSort', 'hasDisplayRow', 'hasAverage', 'hasIndispoInfo', 'processing'],
    name : 'Table',
    data(){
        return{
            canPauseAndStop: process.env.canPauseAndStop,
            sortKey: '',
            currenttimestamp:moment().format('X')
        }
    },
    updated() {
        $('[data-toggle="tooltip"]').tooltip();
    },
    computed: {
        colspan :{
            get : function(){
                let value = 2
                value += this.months.length
                if(this.hasIndispoInfo)
                    value += 4;

                return value;
            }
        }
    },
    created() {
        this.$nextTick(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });
    },
    filters: {
        getmonthexpire(value){
           let nbday = (value - parseInt(moment().format('X'))) / 86400;
           var nbmonth = Math.floor( nbday );
           return "Expire dans : "+nbmonth+" jours";
        },
        formatNumber (value) {
            var number = value.toFixed(3)
            return number.toString().replace('.', ',');
        }
    },
    methods: {
        sortBy: function(name) {
            let vm = this
            if(this.hasSort){
                vm.$emit('sortBy', name)
            }
        },
        displayRow: function(index){
            let vm = this
            if(this.displayRow)
                vm.$emit('displayRow', index)
        },
        pauseMonitor: function(e){
            e.preventDefault();
            let id = e.currentTarget.getAttribute('data-id');
            this.$emit('pauseMonitor', id)
        },
        continueMonitor: function(e){
            e.preventDefault();
            let id = e.currentTarget.getAttribute('data-id');
            this.$emit('continueMonitor', id)
        }
    }
}
</script>
<style>

.not-ssl {
    color:#dc3545;
}

.alert-ssl {
    color: #ffc107;
}

.addFavorite {
    color: #ffc107;
}



</style>
