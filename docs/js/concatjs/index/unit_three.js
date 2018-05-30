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
	T.Load('./parts/index/unit_three.html',"#unit_three",function(){
		//setTimeout(function() {T.GoPage('#dt');},1500);
		//T.MyPost('',function(){},{aa:'bbbbb'});
		//带登录信息及参数（POST）请尔
		//T.MyPost('',function(){},$.extend(T.LoginInfo,{b:"bb"}));
		//带登录信息及参数（ｇｅｔ）请尔
		//T.MyGet('',function(){},$.extend(T.LoginInfo,{b:"bb"}));
		//ajax得到的数据，需要共享可以根据自已的命名空间挂到T.Alldata，例如T.AllData.DataTemp=?


		//共同传的参数
		// T.AllData.unitId = {id:T.LoginInfo.userDefaultProject.id}  //组织ID
		// T.AllData.nowProjectName = {name:T.LoginInfo.userDefaultProject.orgUnitName} //组织名字
		//T.AllData.meterType = {merterType:type};  //仪表类型
		// T.AllData.userId = {id:T.LoginInfo.userId} //用户ID
		// T.AllData.orgUnitLevel = {leve:T.LoginInfo.userDefaultProject.orgUnitLevel} //组织级别

		var params= {'unitId':1179,'name':'深圳思源','orgUnitLevel':'','organization':1,'payTypeCode':'','meterId':'','Practical':'没单位'};

		params.unitId=T.AllData.unitId;
		params.name= T.AllData.nowProjectName;
		params.organization= T.AllData.userId;
		params.payTypeCode= T.AllData.meterType;
		T.AllData.commonData=params;

		//	方法
		var ms ={
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
				T.MyGet('api/meter_dosage_by_unit_id.json',function(res){
					if(res.status==0){
						that.data=res;
						indexVue.$nextTick(function(that){
							this.estimateExchange(0);
						});
					}else{
						T.Tip(res.message);
					}
				},{'unitId':params.unitId.id,'payType':params.payTypeCode.merterType});
			},
			//跳转水电表
			waterElectricity:function(v,n){
				params.meterName=n;
				params.meterId=v;
				T.GoPage('#unit_four');
			},
			Type:function(){
				if(params.payTypeCode.merterType=='paytype_1' || params.payTypeCode.merterType=='payType_1'){
					this.payTypeCode='水表'
				}else{
					this.payTypeCode='电表'
				}
			},
			//实际预估切换
			estimateExchange:function(index){
				this.estimatePractical=index;
				params.Practical=index;
				var info=this.info;
				var that=this;
					if(index==0){
					//	预估
					var predict=this.data.data.predict;
					var predictInfo=this.data.data.predictInfo;
						info.compare=(predictInfo.compare||0)*100;
						info.lastTotal=predictInfo.lastTotal;
						info.time=(predictInfo.time).split('\ ')[0].split('\-');
						info.total=predictInfo.total;
						this.listdata=predict;
						$.each(predict,function(i,v){
							//同比
							that.listdata[i].together='';
							if(v.dosage==null||v.dosage==''){
								return
							}
							if(v.lastDosage==null||v.lastDosage==''){
								return
							}
							that.listdata[i].together=(T.accMul(T.accSub(T.accDiv(v.dosage,v.lastDosage),1),100)).toFixed(1);
							if(that.listdata[i].together==0){that.listdata[i].together=Math.abs(that.listdata[i].together)}
						});

					}else if(index==1){
					//	实际
						var actual=this.data.data.actual;
						var actualInfo=this.data.data.actualInfo;
						info.compare=(actualInfo.compare||0)*100;
						info.lastTotal=actualInfo.lastTotal;
						info.time=(actualInfo.time).split('\ ')[0].split('\-');
						info.total=actualInfo.total;
						this.listdata=actual;
						$.each(actual,function(i,v){
							//同比
							that.listdata[i].together='';
							if(v.dosage==null||v.dosage==''){
								return
							}
							if(v.lastDosage==null||v.lastDosage==''){
								return
							}
							that.listdata[i].together=(T.accMul(T.accSub(T.accDiv(v.dosage,v.lastDosage),1),100)).toFixed(1);
							if(that.listdata[i].together==0){that.listdata[i].together=Math.abs(that.listdata[i].together)};
						});

				}

				var a=String(info.total).split('.')[0];
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


			},
			units:function(){
				if(params.payTypeCode.merterType =='payType_1' || params.payTypeCode.merterType =='paytype_1'){
					this.unitThtree='吨'
				}else{	this.unitThtree='度'}
			}
		};

		//	配置参数
		var indexVue ={
			el:'#unitThree',
			data:{
				//	度和吨判断
				'unitThtree':'',
				//	度和吨判断
				'unitThtree2':'没单位',
				//标题
				'payTypeCode':'',
				//组织ID:
				'unitId':params.unitId.id,
				//组织name:
				'name':params.name.name,
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
					'total':''
				},
				//列表数据
				'listdata':[]
			},
			created:function(){
				this.getData();
				this.Type();
				this.units();
			},
			methods:ms,
			mounted:function(){

			},
			nextTick:function(){
			},
			watch:{
				'organization.name.name':{
					handler:function(curVal,oldVal){
						if(curVal==oldVal)return;
						this.name=params.name.name;
						this.getData();
					},
					deep:true
				},
				'organization.payTypeCode.merterType':{
					handler:function(curVal,oldVal){
						if(curVal==oldVal)return;
						this.units();
						this.Type();
						this.getData();
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
			//	返回
			$("#unitThreeGo").on("click",function(){
				T.GoPage(false);
			});

		});





		// 这里面写工作代码
		});
	})();
