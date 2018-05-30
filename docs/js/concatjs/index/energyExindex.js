( function() {
	'use strict';
	var T = new AllFunc();
	var ID={userId:'6605'};
	T.AutoLogin(ID,65535,function(){
		T.Load( './parts/index/energyExindex.html', "#energyExindex", function() {
			T.MyGet('/nets-budget/api/org/org_tree_data_query_auth',function(projectID){
			document.getElementById("entryBody").style.display="block"
			T.AllData.unitId = {
				id: projectID.data[0].id
			}
			T.AllData.nowProjectName = {
				name: projectID.data[0].orgUnitName
			}
			T.AllData.userId = {
				id: T.LoginInfo.userId
			}
			T.AllData.orgUnitLevel = {
				leve: projectID.data[0].orgUnitLevel
			}
			T.AllData.meterType = {
				merterType: ''
			};
			var exIndexData = {
				info: {
					date: '',
					compareToLast: 0,
					totlaPay: 0,
					totlaPredict: 0,
					usePersent: 0
				},
				data: [ {
					month: "",
					pay: '',
					lastPay: '',
					YOY: '',
					chain: ''
				} ]
			};
			exIndexData.nowProjectName = T.AllData.nowProjectName;
			exIndexData.unitId = T.AllData.unitId;
			exIndexData.JsonCache = {};
			exIndexData.classType = 'all';
			var indexCharts = {};
			T.MyGet( '/nets-platform-energy-api/payment_analyze/month_payment', function( d ) {
				exIndexData.JsonCache = d;
				createEcharts( 'all' );
			}, {
				unitId: exIndexData.unitId.id //APP PROVIDE
			} )

			function createEcharts( unitType ) {
				var d = exIndexData.JsonCache;
				var _tempArr = []
				exIndexData.info.date = d.data.info[ unitType ].time.split( '\ ' )[ 0 ].split( '\-' );
				exIndexData.info.compareToLast = d.data.info[ unitType ].usePersent ? ( (d.data.info[ unitType ].usePersent*100).toFixed( 2 ) + '' ).split( '\.' ) : [ 0, 0 ];
				// exIndexData.info.compareToLast = d.data.info[ unitType ].compareToLast ? ( d.data.info[ unitType ].compareToLast.toFixed( 1 ) + '' ).split( '\.' ) : [ 0, 0 ];
				exIndexData.info.totlaPay = T.accDiv( d.data.info[ unitType ].totalPay, 10000 ).toFixed( 2 );
				exIndexData.info.totlaPredict = T.accDiv( d.data.info[ unitType ].totalPredict, 10000 ).toFixed( 2 );
				exIndexData.info.usePersent = T.accMul( d.data.info[ unitType ].compareToLast || 0, 100 );
				// exIndexData.info.usePersent = T.accMul( d.data.info[ unitType ].usePersent || 0, 100 );
				for ( var i = 0; i < d.data[ unitType ].length; i++ ) {
					var month = d.data[ unitType ][ i ].month - 0,
						predict =((d.data[unitType][i].predict-0)/10000).toFixed(2) ,
						pay = ((d.data[ unitType ][ i ].pay - 0 )/ 10000).toFixed(2),
						lastPay = ((d.data[ unitType ][ i ].lastPay - 0 ) /10000).toFixed(2),
						YOY = "",
						chain = "";
					if ( pay == "null" || lastPay == "null" || !isFinite( pay ) || !isFinite( lastPay ) || pay == 0 ) {
						YOY = 0;
					} else {
						YOY = ( T.accSub( T.accDiv( pay, lastPay ), 1 ) * 100 - 0 ).toFixed( 2 );
					}
					if ( d.data[ unitType ][ i ].month == '01' ) {
						chain = '0';
					} else if ( pay == null || pay == 0 ||d.data[ unitType ][i-1].pay == null || !isFinite( pay ) || !isFinite( d.data[ unitType ][i-1].pay ) ||d.data[ unitType ][i-1].pay === 0 )
					 {
						chain = '0';
					} else {
						chain = ( ( T.accSub( T.accDiv( pay, (d.data[ unitType ][i-1].pay /10000) ), 1 ) ) * 100 - 0 ).toFixed( 2 );
					}
					if ( !isFinite( YOY ) ) {
						YOY = '0';
					}
					if ( !isFinite( chain ) ) {
						chain = '0';
					}

					_tempArr.push( {
						'predict':predict,
						'month': month,
						'pay': pay,
						'lastPay': lastPay,
						'YOY': YOY,
						'chain': chain
					} )
				}
				exIndexData.data = _tempArr;
				var ecMouth = [],
					ecPay = [],
					ecLastPay = [],
					ecRate = []

				for ( var i = 0; i < exIndexData.data.length; i++ ) {
					ecMouth.push( {
						value: exIndexData.data[ i ].month + '\n月',
						textStyle: {
							color: '#777E8C'
						}
					} );
					ecPay.push( T.accDiv( exIndexData.data[ i ].pay, 1 ).toFixed(2) );
					ecLastPay.push( T.accDiv( exIndexData.data[ i ].lastPay, 1 ).toFixed(2) );
					ecRate.push( ( exIndexData.data[ i ].pay / exIndexData.data[ i ].predict *100 ).toFixed( 2 ) || '0' )

				}
				exIndexData.option = {
					dataZoom: [ {
						type: 'inside',
						zoomLock: 'true' //,
						// startValue: 0,
						// endValue: 7
					} ],
					grid: {
						bottom: '100px'
					},
					legend: {
						data: [ '本年度各月实际支出', '上一年度各月实际支出', '本年度各月使用率' ],
						top: 'bottom',
						orient: 'vertical',
						itemGap: 10,
						right: 0,
						itemWidth: 25,
						itemHeight: 11,
						textStyle: {
							color: '#666666',
						}
					},
					xAxis: [ {
						axisTick: false,
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						},
						type: 'category',
						data: ecMouth,
						axisPointer: {
							type: 'shadow'
						},
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						}
					} ],
					yAxis: [ {
							type: 'value',
							name: '万元',
							axisTick: false,
							// min: 0,
							// max: 250,
							// interval: 50,
							minInterval: 1,
							boundaryGap: true,
							nameTextStyle: {
								color: '#777E8C',
							},
							axisLine: {
								lineStyle: {
									color: '#008ACD'
								}
							},
							axisLabel: {
								formatter: '{value}',
								textStyle: {
									color: '#777E8C'
								}
							}
						},
						{
							type: 'value',
							name: '%',
							axisTick: false,
							minInterval: 1,
							nameTextStyle: {
								color: '#777E8C',
							},
							axisLine: {
								lineStyle: {
									color: '#008ACD'
								}
							},
							axisLabel: {
								formatter: '{value}',
								textStyle: {
									color: '#777E8C'
								}
							},
							splitLine: {
								lineStyle: {
									color: [ '#EEEEEE' ],

								}
							}
						}
					],
					series: [ {
							name: '本年度各月实际支出',
							// barWidth:'20px',
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#78B9FF'
								}
							},
							data: ecPay
							// data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
						},
						{
							name: '上一年度各月实际支出',
							// barWidth:'20px',
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#6DC56E'
								}
							},
							data: ecLastPay
							// data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
						},
						{
							name: '本年度各月使用率',
							type: 'line',
							lineStyle: {
								normal: {
									color: '#FF723A',
								}
							},
							itemStyle: {
								normal: {
									color: '#FF723A',
									borderColor: '#FF723A',
									borderWidth: 4,
									shadowBlur:4
								}
							},
							yAxisIndex: 1,
							data: ecRate
							// data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
						}
					]
				};
				indexCharts.setOption( exIndexData.option );
			}
			var energyExindex = new Vue( {
				el: '#entryBody',
				data: exIndexData,
				methods: {
					selChange: function() {
						var userId = T.AllData.userId.id,
							callBack = function( e ) {
								T.AllData.nowProjectName.name = e.name
								T.AllData.unitId.id = e.id;
								T.AllData.orgUnitLevel = {leve:e.orgUnitLevel};
								T.MyGet( '/nets-platform-energy-api/payment_analyze/month_payment', function( d ) {
									exIndexData.JsonCache = d;
									createEcharts( exIndexData.classType );
								}, {
									unitId: e.id
								} );
							};
						T.AllData.selectUnit( userId, exIndexData.nowProjectName.name, callBack )
					},
					goBack: function() {
						T.GoPage( false, 'right' );
					},
					changeFormatType: function( type ) {
						exIndexData.classType = type;
						createEcharts( type );
					},
					isActive: function( type ) {
						return {
							"active": ( exIndexData.classType == type )
						}
					}

				},
				directives: {
					//入口页向上滑跳转页面
					slinding: function( el ) {
						var screenH = document.documentElement.clientHeight;
						el.addEventListener( 'touchstart', function( ev ) {
							//屏幕总高度
							var oTouchStart = ev.targetTouches[ 0 ];
							//按下时坐标
							var touchY = oTouchStart.pageY;
							//限制按下的距离在底部 100 以内
							if ( screenH - oTouchStart.pageY < 100 ) {
								var fnEnd = function( ev ) {
									var oTouchEnd = ev.changedTouches[ 0 ];
									//如果移动的距离大于  100  的时候就跳转页面
									if ( touchY - oTouchEnd.pageY > 100 ) {
										T.GoPage( "#energyExclass", 'up' );
									}
									document.removeEventListener( 'touchend', fnEnd, false );
								}
								document.addEventListener( 'touchend', fnEnd, false );
							}
							//ev.preventDefault && ev.preventDefault();
						}, false );
					}
				},
				mounted: function() {
					indexCharts = echarts.init( document.getElementById( 'indexCharts' ) );
					var energyExswiper = new Swiper( '.swiper-container', {
						pagination: '.swiper-pagination',
						autoHeight: true,
						paginationClickable: true,
					} )
				},
				watch: {
					unitId: {
						handler: function() {
							T.MyGet( '/nets-platform-energy-api/payment_analyze/month_payment', function( d ) {
								exIndexData.JsonCache = d;
								createEcharts( exIndexData.classType );
							}, {
								unitId: exIndexData.unitId.id
							} );
						},
						deep: true
					}
				}
			} );
		
			},{
				userId:T.LoginInfo.userId
			})
		} );


	});

} )();
