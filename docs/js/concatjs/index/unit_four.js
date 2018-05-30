(function(){
    'use strict';
    //该工具现有转场,ajax自动loading,加载器功能，及提示方法下面是示例
    var T=new AllFunc();
    /*
     suc全指回调
     T.GoPage(3);//转场到第三个页面
     T.MyGet(url,suc);
     T.MyPost(url,suc,data);//data为JS数据，会自动处理成{a:'aa'} a=aa
     T.Load(url,"#putdom",suc);//第二个参数可以传选择器，也可以传具体的dom
     loading已自动处理，也可以显示的调用与隐藏
     T.LdShow();
     T.LdHide();
     T.Tip("网络错误")//3秒后会自动隐藏
     T.LoginInfo  这里面存了登录需要的字段
     T.AllData数据挂载点，
     为避免可能出现的BUG请把入口模块挂第一个dom挂载点，挂载完成之后立调用转场函数
     */
    T.Load('./parts/index/unit_four.html',"#unit_four",function(){
        //setTimeout(function() {T.GoPage('#dt');},1500);
        //T.MyPost('',function(){},{aa:'bbbbb'});
        //带登录信息及参数（POST）请尔
        //T.MyPost('',function(){},$.extend(T.LoginInfo,{b:"bb"}));
        //带登录信息及参数（ｇｅｔ）请尔
        //T.MyGet('',function(){},$.extend(T.LoginInfo,{b:"bb"}));
        //ajax得到的数据，需要共享可以根据自已的命名空间挂到T.Alldata，例如T.AllData.DataTemp=?


        //共同传的参数
        var params=T.AllData.commonData;
        //params.meterId=27122;
        //	方法
        var num;
        var ms ={
            echarts:function(){
                var that = this;
                var nhCharts = echarts.init(document.getElementById('waterElectricityEcharts'),'oneWalden');
                var option = {
                    "line": {
                        "itemStyle": {
                            "normal": {
                                "borderWidth": "8"
                            }
                        },

                        "symbolSize": "10",
                        "symbol": "emptyCircle",
                        "smooth": false
                    },

                    xAxis : [
                        {

                            type : 'category',
                            data :this.listdata.monthNo,
                            axisLabel:{
                                interval:'0',

                            },
                            splitLine:{
                                show:false
                            },
                            //axisTick: {length:1},


                        }
                    ],
                    grid: { // 控制图的大小，调整下面这些值就可以，
                        x:num,
                        x2:10,
                        y:20,
                        y2:80


                    },
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel: {
                                formatter: function(val,index){
                                    var text='';
                                    if(index === 0){
                                        text=that.unitThtree;
                                    }else{
                                        text=val;
                                    }
                                    return text;
                                },

                            }

                        }
                    ],
                    series : [
                        {
                            name:'蒸发量',
                            type:'line',
                            data:this.listdata.nowYear,
                            hoverAnimation:false,
                            "symbolSize": "6",
                            "lineStyle": {
                                "normal": {
                                    "width": "2"
                                }
                            },
                            symbol: 'circle'

                        },
                        {
                            name:'降水量',
                            type:'line',
                            data:this.listdata.lastYear,
                            hoverAnimation:false,
                            "symbolSize": "6",
                            "lineStyle": {
                                "normal": {
                                    "width": "2"
                                }
                            },
                            symbol: 'circle'
                        }
                    ],

                };
                nhCharts.setOption(option);
                nhCharts.resize();
            },
            //获取组织数据
            selChange:function(){
                T.AllData.selectUnitstatus = false;
                var that=this._data;
                var callBack = function(data){


                    params.orgUnitLevel=data.orgUnitLevel;
                    params.unitId.id=data.id;
                    params.name.name=data.name;

                };
                T.AllData.selectUnit(params.organization.id,params.name.name,callBack)
            },
            //获取主页数据
            getData:function(){

                var that = this._data;
                T.MyGet('api/dosage_by_meter_id.json',function(res){
                    if(res.status==0){


                        $.each(res.data.actual,function(i,v){
                            v.monthNo=v.monthNo - 0 + '\n月'
                        });
                        $.each(res.data.predict,function(i,v){
                            v.monthNo=v.monthNo - 0 + '\n月'
                        });
                        that.data=res;

                        indexVue.$nextTick(function(that){
                            this.estimateExchange(params.Practical);
                            var swiper = new Swiper('#unitSwperTwoNnit_four', {
                                pagination: '#unitPaginationWTwoNnit_four',
                                paginationClickable: true,
                                spaceBetween: 30,
                                autoHeight: true
                            });
                            this.echarts();
                        });
                    }else{
                        T.Tip(res.message);
                    }
                },{'meterId':params.meterId})
            },
            estimateExchange:function(index){
                params.Practical=index;
                this.estimatePractical=index;
                var info=this.info;
                var that=this;
                that.listdata.monthNo=[];
                that.listdata.nowYear=[];
                that.listdata.lastYear=[];
                if(index==0){
                    //	预估
                    var predict=this.data.data.predict;
                    var predictInfo=this.data.data.predictInfo;
                    info.compare=(predictInfo.compare||0)*100;
                    info.lastTotal=predictInfo.lastTotal;
                    info.time=(predictInfo.time).split('\ ')[0].split('\-');
                    info.total=predictInfo.total;
                    this.listdata.list=predict;
                    $.each(predict,function(i,v){
                        that.listdata.monthNo.push(v.monthNo);
                        that.listdata.nowYear.push(v.dosage);
                        that.listdata.lastYear.push(v.lastDosage||0);
                        that.listdata.list[i].together='';
                        that.listdata.list[i].loop='';
                        //同比
                        if(v.dosage===null||v.dosage==='')return;
                        if(v.lastDosage===null||v.lastDosage=='')return;
                        that.listdata.list[i].together=(T.accDiv(T.accSub(T.accDiv(v.dosage,v.lastDosage),1),100)).toFixed(1);
                        //环比
                        if(!(i==0)){
                          if(predict[i-1].dosage===null||predict[i-1].dosage=='')return;
                            that.listdata.list[i].loop=(T.accDiv(T.accSub(T.accDiv(v.dosage,predict[i-1].dosage),1),100)).toFixed(1);
                        }else{
                            that.listdata.list[i].loop=0;
                        };
                    });
                }else if(index==1){
                    //	实际
                    var actual=this.data.data.actual;
                    var actualInfo=this.data.data.actualInfo;
                    info.compare=(actualInfo.compare||0)*100;
                    info.lastTotal=actualInfo.lastTotal;
                    info.time=(actualInfo.time).split('\ ')[0].split('\-');
                    info.total=actualInfo.total;
                    this.listdata.list=actual;
                    $.each(actual,function(i,v){
                        that.listdata.monthNo.push(v.monthNo);
                        that.listdata.nowYear.push(v.dosage);
                        that.listdata.lastYear.push(v.lastDosage||0);
                        that.listdata.list[i].together='';
                        that.listdata.list[i].loop='';
                        //同比
                        if(v.dosage==null||v.dosage=='')return;
                        if(v.lastDosage==null||v.lastDosage=='')return;
                        that.listdata.list[i].together=(T.accMul(T.accSub(T.accDiv(v.dosage,v.lastDosage),1),100)).toFixed(1);
                        //环比
                        if(!(i==0)){
                            if(actual[i-1].dosage==null||actual[i-1].dosage=='')return;
                            that.listdata.list[i].loop=(T.accMul(T.accSub(T.accDiv(v.dosage,actual[i-1].dosage),1),100)).toFixed(1);
                        }else{
                            that.listdata.list[i].loop=0;
                        }
                    });
                }

                var a=String(info.total).split('.')[0];
                num=30+(a.length*5);
                if(a.length>9){
                    info.total=(info.total/1000000000).toFixed(2);
                    this.unitThtree2='十亿'+	this.unitThtree;
                }else if(a.length>7){
                    info.total=(info.total/10000000).toFixed(2);
                    this.unitThtree2='千万'+	this.unitThtree;
                }else if(a.length>5){
                    info.total=(info.total/100000).toFixed(2);
                    this.unitThtree2='十万'+	this.unitThtree;
                }else{
                    this.unitThtree2=''+this.unitThtree;
                }



                this.echarts();
                T.LdHide();
            },
            units:function(){
                if(params.payTypeCode.merterType=='paytype_1' ||params.payTypeCode.merterType=='payType_1'){
                    this.unitThtree='吨'
                }else{	this.unitThtree='度'}
            }
        };

        //	配置参数
        var indexVue ={
            el:'#unitFour',
            data:{
                //	度和吨判断
                'unitThtree':'',
                //	度和吨判断
                'unitThtree2':'没单位',
                //标题
                'meterName':params.meterName,
                //组织ID:
                'unitId':params.unitId.id,
                //组织name:
                'name':params.name.name,
                //监视组织架构变化属性
                'organization':params,
                //预估实际切换
                'estimatePractical':0,
                //总数据
                'data':"",
                //表头数据
                'info':{
                    //时间
                    'time':'',
                    //同比(%)
                    'compare':'',
                    //上一年累计用量
                    'lastTotal':'',
                    //本年累计用量
                    'total':'',
                },
                //列表数据
                'listdata':{
                    //月份
                    'monthNo':[],
                    //本年
                    'nowYear':[],
                    //上一年
                    'lastYear':[],
                    //列表数据
                    'list':[],
                },
            },
            created:function(){
                this.getData();
                this.units();
            },
            methods:ms,

            watch:{

                'organization.name.name':{
                    handler:function(curVal,oldVal){
                        if(curVal==oldVal)return;
                        this.name=params.name.name;
                        this.getData();
                    },
                    deep:true
                },
                'organization.meterId':{
                    handler:function(curVal,oldVal){
                        if(curVal==oldVal)return;
                        this.meterName=params.meterName;
                        this.getData();
                    },
                    deep:true
                },
                'organization.payTypeCode.merterType':{
                    handler:function(curVal,oldVal){
                        if(curVal==oldVal)return;
                        this.units();
                    },
                    deep:true
                },
                'organization.Practical':{
                    handler:function(curVal,oldVal){
                        if(curVal==oldVal)return;
                        this.estimateExchange(params.Practical);
                    },
                    deep:true
                },

            },

        };

        indexVue = new Vue(indexVue);
        indexVue.$nextTick(function(){
            $("#unitFourGo").on("click",function(){
                T.GoPage(false);
            });

        });




        // 这里面写工作代码
    });
})();
