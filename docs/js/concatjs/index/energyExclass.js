( function() {
	'use strict';
	var T = new AllFunc();
	T.Load( './parts/index/energyExclass.html', "#energyExclass", function() {
		var exClassData = {
			info: {
				date: '',
				compareToLast: 0,
				totlaPay: 0,
				totlaPredict: 0,
				usePersent: 0
			}
		};
		exClassData.nowProjectName = T.AllData.nowProjectName;
		exClassData.orgLevel = T.AllData.orgUnitLevel;
		exClassData.unitId = T.AllData.unitId;
		exClassData.classType = 'all';
		exClassData.classDate = 'nowYear';
		exClassData.classSort = 'actual';
		exClassData.tableType = 'unity';
		exClassData.echartBaseHeigh = 0;
		exClassData.ecGridPading = 0;
		var eneryClassCharts = {};
		exClassData.dataUnity = [];
		exClassData.dataMonth = [];
		exClassData.dataType = [];
		/**
		 * [createTables 刷新界面表格]
		 * @method createTables
		 * @return {[type]}      [description]
		 */
		function createTables() {
			// 判断组织级别,设置默认显示开始栏
			if ( exClassData.orgLevel.leve == 4 ) {
				exClassData.tableType = 'month';
			} else {
				exClassData.tableType = 'unity';
			}
			//
			// 获取数据
			getData();

		}
		/**
		 * [getData 根据类型获取不同数据,判断是否有缓存数据]
		 * @method getData
		 * @return {[type]} [description]
		 */
		function getData() {
			if ( exClassData.tableType == 'unity' ) {
				if ( exClassData.orgLevel.leve != 4 ) {
					if ( typeof( exClassData.JsonCacheUnity ) == 'undefined') {
						T.MyGet( 'api/org_payment.json', function( d ) {
							exClassData.JsonCacheUnity = d;
							eneryClassCharts.getDom().style.height = exClassData.echartBaseHeigh + ( exClassData.ecGridPading * 12 ) + 'px';
				      eneryClassCharts.resize( {
				        height: exClassData.echartBaseHeigh + ( exClassData.ecGridPading * 12 )
				      } )
				      eneryClassCharts.setOption( {
				        grid: {
				          bottom: ( ( exClassData.ecGridPading + 8 ) * 12 ),
				        }
				      } )

							setInfoData();
							// echaart更新
							createEcharts();
						}, {
							unitId: exClassData.unitId.id,
							sort : exClassData.classSort
						} );
					} else {

						setInfoData();
						// echaart更新
						createEcharts();
					}
				} else {
					exClassData.tableType = 'month';
				}
			} else
			if ( exClassData.tableType == 'month' ) {
				if ( typeof( exClassData.JsonCacheMonth ) == 'undefined') {
					T.MyGet( 'api/month_payment.json', function( d ) {
						exClassData.JsonCacheMonth = d;

						setInfoData();
						// echaart更新
						createEcharts();
					}, {
						unitId: exClassData.unitId.id
					} );
				} else {

					setInfoData();
					// echaart更新
					createEcharts();
				}
			} else
			if ( exClassData.tableType == 'type' ) {
				if ( typeof( exClassData.JsonCacheType ) == 'undefined') {
					T.MyGet( 'api/business_payment.json', function( d ) {
						exClassData.JsonCacheType = d;
						setInfoData();
						// echaart更新
						createEcharts();
					}, {
						unitId: exClassData.unitId.id
					} );
				} else {
					setInfoData();
					// echaart更新
					createEcharts();
				}
			}

		};
		/**
		 * [setInfoData 设置表头总汇信息]
		 * @method setInfoData
		 */
		function setInfoData() {
			if ( exClassData.tableType == 'unity' ) {
				var d = exClassData.JsonCacheUnity
			} else
			if ( exClassData.tableType == 'month' ) {
				var d = exClassData.JsonCacheMonth
			} else
			if ( exClassData.tableType == 'type' ) {
				var d = exClassData.JsonCacheType
			}
			if ( exClassData.tableType == 'type' || exClassData.tableType == 'unity' ) {
				exClassData.info.date = d.data[ exClassData.classDate ].info[ exClassData.classType ].time.split( '\ ' )[ 0 ].split( '\-' );
				// exClassData.info.compareToLast = d.data[ exClassData.classDate ].info[ exClassData.classType ].compareToLast;
				exClassData.info.compareToLast = ( d.data[ exClassData.classDate ].info[ exClassData.classType ].totalPay / 10000 ).toFixed( 2 );
				exClassData.info.totlaPay = ( d.data[ exClassData.classDate ].info[ exClassData.classType ].totalPay / 10000 ).toFixed( 2 );
				exClassData.info.totlaPredict = ( d.data[ exClassData.classDate ].info[ exClassData.classType ].totalPredict / 10000 ).toFixed( 2 );
				exClassData.info.usePersent = T.accMul( d.data[ exClassData.classDate ].info[ exClassData.classType ].usePersent, 100 ).toFixed( 2 );
			} else {
				exClassData.info.date = d.data.info[ exClassData.classType ].time.split( '\ ' )[ 0 ].split( '\-' );
				// exClassData.info.compareToLast = d.data.info[ exClassData.classType ].compareToLast || 0;
				exClassData.info.compareToLast = ( d.data.info[ exClassData.classType ].totalPay / 10000 ).toFixed( 2 );
				exClassData.info.totlaPay = ( d.data.info[ exClassData.classType ].totalPay / 10000 ).toFixed( 2 );
				exClassData.info.totlaPredict = ( d.data.info[ exClassData.classType ].totalPredict / 10000 ).toFixed( 2 );
				exClassData.info.usePersent = T.accMul( d.data.info[ exClassData.classType ].usePersent, 100 ).toFixed( 2 );
			}
		};
		/**
		 * [createEcharts echart表格更新,底部数据联动]
		 * @method createEcharts
		 * @return {[type]}      [description]
		 */
		function createEcharts() {

			if ( exClassData.tableType == 'unity' ) {
				var d = exClassData.JsonCacheUnity;
				var _tempArr = [];
				var ecExceed = [],
					ecOrgName = [],
					ecPay = [],
					ecPredict = [],
					ecUsePersent = []
				for ( var i = 0; i < d.data[ exClassData.classDate ][ exClassData.classType ].length; i++ ) {
					var rank = i - 0 + 1,
						orgName = d.data[ exClassData.classDate ][ exClassData.classType ][ i ].orgName,
						orgId = d.data[ exClassData.classDate ][ exClassData.classType ][ i ].orgId,
						pay = ( ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].pay - 0 ) / 10000 ).toFixed( 2 ),
						predict = ( ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].predict - 0 ) / 10000 ).toFixed( 2 ),
						usePersent = T.accMul( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].usePersent || 0, 100 ).toFixed( 2 );
					_tempArr.push( {
						'rank': rank,
						'orgName': orgName,
						'orgId': orgId,
						'pay': pay,
						'predict': predict,
						'usePersent': usePersent
					} );
					ecPay.push( pay );
					ecPredict.push( predict );
					ecUsePersent.push( usePersent );
					ecExceed.push(
						( pay - predict ) > 0 ? ( pay - predict ) : 0
					)
				}
				exClassData.dataUnity = _tempArr;
				for ( var i = 0; i < d.data[ exClassData.classDate ][ exClassData.classType ].length; i++ ) {
					ecOrgName.push( {
						value: d.data[ exClassData.classDate ][ exClassData.classType ][ i ].orgName.split( '' ).join( '\n' ),
						textStyle: {
							color: '#777E8C',
						}
					} );
					if ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].orgName.length - 8 > exClassData.ecGridPading ) {
						exClassData.ecGridPading = d.data[ exClassData.classDate ][ exClassData.classType ][ i ].orgName.length - 7;
					}
				}
				exClassData.optionUnity = {
					dataZoom: [ {
						type: 'inside',
						zoomLock: true,
						startValue: 0,
						endValue: 11
					} ],
					legend: {
						data: [ '预算', '实际', '使用率' ],
						left: 'center',
						right: 0,
						itemWidth: 25,
						itemHeight: 11,
						textStyle: {
							color: '#666666',
						}
					},
					xAxis: {
						axisTick: false,
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						},
						type: 'category',
						data: ecOrgName,
						axisPointer: {
							type: 'shadow'
						},
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						}
					},
					yAxis: [ {
						type: 'value',
						name: '万元',
						axisTick: false,
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
					}, {
						type: 'value',
						name: '%',
						axisTick: false,
						// interval: 5,
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
					} ],
					series: [ {
						name: '预算',
						barGap: '-100%',
						type: 'bar',
						stack: '超出预算',
						itemStyle: {
							normal: {
								color: '#78B9FF'
							}
						},
						data: ecPredict
					}, {
						name: '超出预算',
						barGap: '-100%',
						type: 'bar',
						stack: '超出预算',
						itemStyle: {
							normal: {
								color: '#138815'
							}
						},
						data: ecExceed
					}, {
						name: '实际',
						barGap: '-100%',
						type: 'bar',
						itemStyle: {
							normal: {
								color: '#6DC56E',
								opacity: 1
							}
						},
						data: ecPay
					}, {
						name: '使用率',
						barGap: '-100%',
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
							}
						},
						yAxisIndex: 1,
						data: ecUsePersent
					} ]
				};
				eneryClassCharts.clear;
				eneryClassCharts.setOption( exClassData.optionUnity );
			} else
			if ( exClassData.tableType == 'month' ) {
				var d = exClassData.JsonCacheMonth;
				var _tempArr = [];
				var ecMonth = [],
					ecExceed =[],
					ecPay = [],
					ecPredict = [],
					ecUsePersent = []
				for ( var i = 0; i < d.data[ exClassData.classType ].length; i++ ) {
					var month = ( d.data[ exClassData.classType ][ i ].month ) - 0,
						pay = ( ( d.data[ exClassData.classType ][ i ].pay - 0 ) / 10000 || 0 ).toFixed( 2 ),
						predict = ( ( ( d.data[ exClassData.classType ][ i ].predict ) - 0 ) / 10000 || 0 ).toFixed( 2 ),
						usePersent = ( ( d.data[ exClassData.classType ][ i ].usePersent ) * 100 - 0 || 0 ).toFixed( 2 );
					_tempArr.push( {
						'month': month,
						'pay': pay,
						'predict': predict,
						'usePersent': usePersent,
					} );
					ecMonth.push( month + '\n月' );
					ecPay.push( pay );
					ecPredict.push( predict );
					ecUsePersent.push( usePersent );
					ecExceed.push(
						( pay - predict ) > 0 ? ( pay - predict ) : 0
					);
				}
				exClassData.dataMonth = _tempArr;
				eneryClassCharts.setOptionMonth = {
					dataZoom: [ {
						type: 'inside',
						zoomLock: true,
						startValue: 0,
						endValue: 11
					} ],
					legend: {
						data: [ '预算', '实际', '使用率' ],
						left: 'center',
						right: 0,
						itemWidth: 25,
						itemHeight: 11,
						textStyle: {
							color: '#666666',
						}
					},
					xAxis: {
						axisTick: false,
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						},
						type: 'category',
						data: ecMonth,
						axisPointer: {
							type: 'shadow'
						},
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						}
					},
					yAxis: [ {
						type: 'value',
						name: '万元',
						axisTick: false,
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
					}, {
						type: 'value',
						name: '%',
						axisTick: false,
						// interval: 5,
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
					} ],
					series: [ {
						name: '预算',
						barGap: '-100%',
						type: 'bar',
						stack: '超出预算',
						itemStyle: {
							normal: {
								color: '#78B9FF'
							}
						},
						data: ecPredict
					}, {
						name: '超出预算',
						barGap: '-100%',
						type: 'bar',
						stack: '超出预算',
						itemStyle: {
							normal: {
								color: '#138815'
							}
						},
						data: ecExceed
					}, {
						name: '实际',
						barGap: '-100%',
						type: 'bar',
						itemStyle: {
							normal: {
								color: '#6DC56E',
								opacity: 1
							}
						},
						data: ecPay
					}, {
						name: '使用率',
						barGap: '-100%',
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
							}
						},
						yAxisIndex: 1,
						data: ecUsePersent
					} ]
				};
				eneryClassCharts.clear;
				eneryClassCharts.setOption( eneryClassCharts.setOptionMonth );
			} else
			if ( exClassData.tableType == 'type' ) {
				var d = exClassData.JsonCacheType
				var _tempArr = [];
				var ecType = [],
					ecPay = [],
					ecPredict = [],
					ecUsePersent = []
				for ( var i = 0; i < d.data[ exClassData.classDate ][ exClassData.classType ].length; i++ ) {
					var type = ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].payTypeCode ),
						pay = ( ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].pay - 0 ) / 10000 || 0 ).toFixed( 2 ),
						predict = ( ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].predict - 0 ) / 10000 || 0 ).toFixed( 2 ),
						usePersent = ( ( d.data[ exClassData.classDate ][ exClassData.classType ][ i ].usePersent ) * 100 - 0 || 0 ).toFixed( 2 );
					_tempArr.push( {
						'type': type,
						'pay': pay,
						'predict': predict,
						'usePersent': usePersent,
					} );
					ecType.push( type == 'payType_1' || type == 'paytype_1' ? '水表' : type == 'payType_2' || type == 'paytype_2' ? '电表' : '其他' );
					ecPay.push( pay );
					ecPredict.push( predict );
					ecUsePersent.push( usePersent );
					exClassData.dataType = _tempArr;
				}
				eneryClassCharts.setOptionType = {
					dataZoom: [ {
						type: 'inside',
						zoomLock: true,
						startValue: 0,
						endValue: 11
					} ],
					xAxis: {
						axisTick: false,
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						},
						type: 'category',
						data: ecType,
						axisPointer: {
							type: 'shadow'
						},
						axisLine: {
							lineStyle: {
								color: '#008ACD'
							}
						}
					},
					series: [ {
						name: '预算',
						barGap: '-100%',
						type: 'bar',
						itemStyle: {
							normal: {
								color: '#78B9FF'
							}
						},
						data: ecPredict
					}, {
						name: '实际',
						barGap: '-100%',
						type: 'bar',
						itemStyle: {
							normal: {
								color: '#6DC56E',
								opacity: 1
							}
						},
						data: ecPay
					}, {
						name: '使用率',
						barGap: '-100%',
						type: 'scatter',
						lineStyle: {
							normal: {
								color: '#FF723A',
							}
						},
						itemStyle: {
							normal: {
								color: '#FF723A',
								borderColor: '#FF723A',
							}
						},
						yAxisIndex: 1,
						data: ecUsePersent
					} ]
				};
				eneryClassCharts.clear;
				eneryClassCharts.setOption( eneryClassCharts.setOptionType );
			}
		}
		var energyExClass = new Vue( {
			el: '#entryClass',
			data: exClassData,
			computed: {},
			methods: {
				selChange: function() {
					var userId = T.AllData.userId.id,
						callBack = function( d ) {
							T.AllData.nowProjectName.name = d.name;
							T.AllData.unitId.id = d.id;
							T.AllData.orgUnitLevel = {
								leve: d.orgUnitLevel
							};
							exClassData.orgLevel = {
								leve: d.orgUnitLevel
							};
							exClassData.JsonCacheMonth = undefined;
							exClassData.JsonCacheType = undefined;
							exClassData.JsonCacheUnity = undefined;
							getData()
						};
					T.AllData.selectUnit( userId, exClassData.nowProjectName.name, callBack )
				},
				goBack: function() {
					T.GoPage( false, 'up' );
				},
				changeFormatType: function( type, date ) {
					exClassData.classType = type;
					exClassData.classDate = date;
					getData();
				},
				changeTableType: function( tableType ) {
					exClassData.tableType = tableType;
					getData();
				},
				isActive: function( type ) {
					return {
						"active": ( exClassData.classType == type )
					}
				},
				toUnit: function( ids, names ) {
					T.AllData.orgUnitLevel = {
						leve: 4
					};
					exClassData.orgLevel = {
						leve: 4
					};
					exClassData.unitId.id = ids;
					exClassData.nowProjectName.name = names;
				},
				dateActive: function( type ) {
					return {
						"active": ( exClassData.classDate == type )
					}
				},
				sortActive: function( i ) {
					return {
						"icon-xiangxiajiantou c-3395FF": exClassData.classSort == i,
					}
				},
				typeActive: function( i ) {
					return {
						"c-3395FF": exClassData.classSort == i
					}
				},
				byTypeActive: function( i ) {
					return {
						"active": exClassData.tableType == i
					}
				},
				loadData: function( id, sort ) {
					getData( id, sort );
					exClassData.classSort = sort;
					getData(true)
				},
				goToType: function( type ) {
					T.AllData.meterType.merterType = type;
					T.GoPage( '#unit_three', 'right' );
				}
			},
			watch: {
				unitId: {
					handler: function( val, oldVal ) {
						exClassData.JsonCacheMonth = undefined;
						exClassData.JsonCacheType = undefined;
						exClassData.JsonCacheUnity = undefined;
						getData();
					},
					deep: true
				},
				orgLevel: {
					handler: function( val, oldVal ) {
						getData();
					},
					deep: true
				}
			},
			mounted: function() {
				eneryClassCharts = echarts.init( document.getElementById( 'eneryClassCharts' ) );
				createTables()
				exClassData.echartBaseHeigh = eneryClassCharts.getHeight();
			}
		} );
	} );
} )();
