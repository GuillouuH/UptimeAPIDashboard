import moment from 'moment'
import axios from 'axios'

export default {
    data(){
        return{
            date : null,
            currentDate: moment().format('X'),
            currentStartDate: null,
            startDate: null,
            range: '',
            months:[],
            custom_interval:["0", "86400"],
            average : [],
            results : [],
            filter : [],
            allLogs : []
        }
    },
    methods: {
        getRange: function(){
            let months = Array()
            let year = moment().format('YYYY')
            this.currentDate = moment().format('X')
            if("year" in this.$route.params && parseInt(year) != this.$route.params.year){
                this.date = this.$route.params.year;
                this.currentDate = moment(this.$route.params.year, 'YYYY').endOf('year').format('X');
            } else {
                this.date = moment(this.currentDate, 'X').startOf('year').format('YYYY');
            }
            let startMonth = moment(this.currentDate, 'X').startOf('month').format('X');
            let startYear = moment(this.currentDate, 'X').startOf('year').format('X');
            if(this.currentStartDate !== null){
                startYear = this.currentStartDate;
                if(startMonth === moment(this.currentStartDate, 'X').startOf('month').format('X')){
                    startMonth = this.currentStartDate;
                }
            }
            this.startDate = startMonth;
            let rang = ""+startMonth+"_"+this.currentDate+"";
            months.push(rang);
            let dateInTheMonth = startMonth-1;
            let startBefore = startMonth;
            while(dateInTheMonth>startYear){
                let startMonth = moment(dateInTheMonth, 'X').startOf('month').format('X');
                let endMonth = startBefore;
                startBefore = startMonth;
                rang = ""+startMonth+"_"+endMonth+"";
                months.push(rang);
                dateInTheMonth = startMonth-1;
            }
            let monthRange = months.join('-');
            let range = monthRange;
            this.range = range;
        },  
        getMonth: function(){
            let months = Array();

            let year = moment().format('YYYY');
            if("year" in this.$route.params && parseInt(year) != this.$route.params.year)
                this.currentDate = parseInt(moment(this.$route.params.year, 'YYYY').endOf('year').format('X'));

            let startMonth = parseInt(moment(this.currentDate, 'X').startOf('month').format('X'));
            
            let startYear = moment(this.currentDate, 'X').startOf('year').format('X');
            if(this.currentStartDate !== null)
                startYear = this.currentStartDate;

            months.push(moment(this.currentDate, 'X').locale('fr').format('MMM'));
            let dateInTheMonth = startMonth-1;
            while(dateInTheMonth>startYear){
                let name = moment(dateInTheMonth, 'X').locale('fr').format('MMM');
                startMonth = parseInt(moment(dateInTheMonth, 'X').startOf('month').format('X'));
                months.unshift(name);
                dateInTheMonth = startMonth-1;
            }
            
            this.months = months
        }, 
        searchForLongerLog: function(log, mode){
            let date = 0;
            let duration = 0;
            let dateInSecond = 0;
            let logs = Array();
            let maxLogDown = Array();

            if(mode == 1){
              for(var i in log){
                if(log[i].type == 1)
                    logs.push(log[i]);
              }
            }else{
                logs = log;
            }
            for (var i in logs){
                if (logs[i].duration>duration){
                    dateInSecond = logs[i].datetime;
                    date = moment(logs[i].datetime, 'X').locale('fr').format('L');
                    duration = logs[i].duration;
                }
            }

            if(mode == 1)
                maxLogDown.push({"date":date, "duration":this.convertSecondIntoTime(duration), "timestamp":duration});
            else
                maxLogDown.push({"date":dateInSecond, "duration":this.convertSecondIntoTime(duration), "timestamp":duration});
            return maxLogDown;
        }, 
        convertSecondIntoTime: function(second){
            let time = 0;
            let days = moment.duration(second, 'seconds').days();
            let hours = moment.duration(second, 'seconds').hours();
            let minutes = moment.duration(second, 'seconds').minutes();
            let seconds = moment.duration(second, 'seconds').seconds();
            
            if(days == "0" && hours == "0" && minutes == "0" )
                time = seconds+" s";
            else if(days == "0" && hours == "0")
                time = minutes+"m"+seconds+"s";
            else if(days == "0")
                time = hours+"h"+minutes+"m"+seconds+"s";
            else
                time = days+"j"+hours+"h"+minutes+"m"+seconds+"s";

            return time;
        }, 
        getUptimeRequest: async function(data, url){
            let vm = this;
            var results = [];
            await axios.post(url, data, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(function (response) {
                var monitors = response.data;
                if(monitors.length > 0)
                for(var i in monitors){
                    var logs = monitors[i].logs;
                    const reducer = (accumulator, currentValue) => accumulator + currentValue;
                    var logsDuration = Array();
                    for(var j in logs)
                        if(logs[j].type == 1)
                            logsDuration.push(logs[j].duration);
                    
                    if(logsDuration.length > 0){
                        var cumul = vm.convertSecondIntoTime(logsDuration.reduce(reducer));
                        var secondeCumul = logsDuration.reduce(reducer);
                    }else{ 
                        var cumul = 0;
                        var secondeCumul = 0;
                    }

                    let range = monitors[i].custom_uptime_ranges;
                    let ranges = range.split('-').reverse();
                    let longerLogDown = vm.searchForLongerLog(monitors[i].logs, 1);
                    var total = 0;
                    var numberRange = 0
                    
                    for(var k in ranges){
                        if(ranges[k] !== "0.000"){
                            numberRange = numberRange + 1;
                            total = total + parseFloat(ranges[k]);
                        }
                    }
                    
                    if(vm.searchForLongerLog(logs, 2).length == 0){
                        vm.allLogs = "empty";
                    }else{
                        vm.allLogs = vm.searchForLongerLog(logs, 2);
                    }     
                    if(total === 0)
                        ranges.unshift("0.000");
                    else 
                        ranges.unshift((total/numberRange).toFixed(3));
                    

                    let tmpAccountName = monitors[i].accountname.split('@');
                    results.push({
                        "status":monitors[i].status,
                        "id":monitors[i].id_object,
                        "name":monitors[i].friendly_name+" - "+tmpAccountName[0],
                        "ranges": ranges.map(Number),
                        "cumul":cumul,
                        "cumulSeconde":secondeCumul,
                        "longerLogDown":longerLogDown,
                        "timestampLogdown": longerLogDown[0]["timestamp"],
                        "logs":vm.allLogs,
                        "url":monitors[i].url,
                        "isVisible":true,
                        "ssl":monitors[i].ssl,
                        "lighthouse":monitors[i].lighthouse,
                        "screenshot":monitors[i].screenshot,
                        "isVisible":true
                    });
                    vm.processing = false;
                }      
            });
            
            localStorage.setItem("uptimeRequest", JSON.stringify(results));
            return results;
        },
        getMoyenne: function(from){
            let vm = this;
            var results = vm.filter;
            var ranges = [];
            vm.average = [];
            if(from === "result")
                vm.average.push("Moyenne") 
            results.forEach(function(element) { 
                if(element["isVisible"])
                    ranges.push(element["ranges"]);
            })
            if(typeof ranges[0] !== "undefined") {
                var lengthArray = ranges[0].length;
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                for(var i = 0; i<lengthArray; i++){
                    var arrayElement = [];
                    for(var j = 0; j<ranges.length; j++){
                        if(ranges[j][i] != 0)
                            arrayElement.push(ranges[j][i]);
                    }
                    if(arrayElement.length != 0){
                        vm.average.push((arrayElement.reduce(reducer)/arrayElement.length).toFixed(3));
                    }
                    else 
                        vm.average.push('nc');              
                }
            } else {
                vm.average = [];
            }

            if(from === "result")
                vm.average.push('','','', '', '');  
                
            if(from === "dashboard") {
                let totalAverage = 0;
                for(var k in vm.average){
                    if(vm.average[k] !== "0.000"){
                        totalAverage = totalAverage + parseFloat(vm.average[k]);
                    }
                }
                vm.averageYear = vm.average[0];
                vm.average.splice(0,1);
            }
        }
    }
}