/**
 * Created by admin on 2017/8/3.
 */

function zero(m){
    return m<10?'0'+m:m;
}

function week(day){
    if (day == 0) {
        return "星期日";
    } else if (day == 1) {
        return "星期一";
    } else if (day == 2) {
        return "星期二";
    } else if (day == 3) {
        return "星期三";
    } else if (day == 4) {
        return "星期四";
    } else if (day == 5) {
        return "星期五";
    } else if (day == 6) {
        return "星期六";
    }
}

function tool (obj,minutes) {
    const date = new Date(obj);
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    m = zero(m);
    d = zero(d);

    if (minutes == 'minutes') {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        hours = zero(hours);
        minutes = zero(minutes);
        return y+'-'+m+'-'+d+' '+hours+':'+minutes;
    } else if(minutes == 'year') {
        return y+'-'+m+'-'+d;
    } else if(minutes == 'chine'){
        let hours = zero(date.getHours());
        let minutes = zero(date.getMinutes());
        let seconds=zero(date.getSeconds());
        let day = week(date.getDay());
        return y + '年' + m + '月' + d +'日' + hours +':' + minutes + ':'+ seconds +' '+ day;
    }

}


class _TimeConversion {
    constructor(){

        this.TIME = obj => {
            return tool(obj)
        };

        this.time = obj => {
            return tool(obj,'minutes');
        };

        this.search = obj => {
            console.log(obj,'year');
            // obj?(
            //     const executeStartTime = this.TIME(obj[0]._d);
            //     const executeEndTime = this.TIME(obj[1]._d);
            //     return [executeStartTime,executeEndTime];
            // ):''


        };

        this.date = _ => {
            let date_ = this.TIME(new Date());
            return date_;
        };

        this.dateChine = _ => {
            let date_ = tool(new Date(),'chine');
            return date_;
        };
    }
}

const TimeConversion = new _TimeConversion();

export default TimeConversion;

