(function() {
    'use strict';
    //该工具现有转场,ajax自动loading,加载器功能，及提示方法下面是示例
    var T = new AllFunc();
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
    */
    T.Load('./parts/index/modeTools.html', "#modeTools", function() {
        //setTimeout(function() {T.GoPage('#dt');},1500);
        //T.MyPost('',function(){},{aa:'bbbbb'});
        //带登录信息及参数（POST）请尔
        //T.MyPost('',function(){},$.extend(T.LoginInfo,{b:"bb"}));
        //带登录信息及参数（ｇｅｔ）请尔
        //T.MyGet('',function(){},$.extend(T.LoginInfo,{b:"bb"}));



        // 这里面写工作代码

        var modeTools = new Vue({
            el: '#modeBody',
            data: {
                name: 'Vue.js',
                one: false,
                two: true,
                three: false,
                isHide: true
            },
            computed: {
                selShow: function() {
                    return {
                        "icon-iconfontunfold": this.isHide,
                        "icon-iconfonunfold": !this.isHide
                    }
                }
            },
            methods: {
                selChange:function(){
                    var userId  =  2,
                        projectName = '深圳思源',
                        callBack = function(d){console.log(d);alert(d.name)};
                        /**
                         * 项目选择
                         * T.AllData.selectUnit(userId,projectName,callBack) 全局调用
                         * @method
                         * @param  {[num,str,obj]}  [用户id,用语默认被选选项的项目名字,回调]
                         * @return {[type,id,name,pid]}   [0为父系1为子系,项目id,项目名称,项目父系id]
                         */
                    T.AllData.selectUnit(userId,projectName,callBack)
                },
                goBack: function(event) {
                    // 图表
                    var nhCharts = echarts.init(document.getElementById('nhCharts'));
                    modeTools.option = {
                        dataZoom: [{
                            type: 'inside'
                        }],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        legend: {
                            data: ['本年度各月实际支出', '上一年度各月实际支出', '本年度个月使用率'],
                            top: 'bottom',
                            right: 0,
                            itemWidth: 25,
                            itemHeight: 11,
                            textStyle: {
                                color: '#666666',
                            }
                        },
                        xAxis: [{
                            axisTick: false,
                            axisLine: {
                                lineStyle: {
                                    color: '#008ACD'
                                }
                            },
                            nameRotate: 180,
                            type: 'category',
                            data: [{
                                value: '1月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '2月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '3月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '4月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '5月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '6月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '7月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '8月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '9月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '10月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '11月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '12月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, ],
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#008ACD'
                                }
                            }
                        }],
                        yAxis: [{
                                type: 'value',
                                name: '万元',
                                axisTick: false,
                                min: 0,
                                max: 250,
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
                                min: 0,
                                max: 25,
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
                                        color: ['#EEEEEE'],

                                    }
                                }
                            }
                        ],
                        series: [{
                                name: '本年度各月实际支出',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#78B9FF'
                                    }
                                },
                                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                            },
                            {
                                name: '上一年度各月实际支出',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#6DC56E'
                                    }
                                },
                                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                            },
                            {
                                name: '本年度个月使用率',
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
                                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                            }
                        ]
                    };
                    nhCharts.setOption(this.option);
                    modeTools.option2 ={
                        dataZoom: [{
                            type: 'inside'
                        }],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        legend: {
                            data: ['本年度各月实际支出', '上一年度各月实际支出', '本年度个月使用率'],
                            top: 'bottom',
                            right: 0,
                            itemWidth: 25,
                            itemHeight: 11,
                            textStyle: {
                                color: '#666666',
                            }
                        },
                        xAxis: [{
                            axisTick: false,
                            axisLine: {
                                lineStyle: {
                                    color: '#008ACD'
                                }
                            },
                            nameRotate: 180,
                            type: 'category',
                            data: [{
                                value: '1月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '2月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '3月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '4月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '5月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '6月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '7月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '8月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '9月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '10月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '11月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, {
                                value: '12月',
                                textStyle: {
                                    color: '#777E8C'
                                }
                            }, ],
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#008ACD'
                                }
                            }
                        }],
                        yAxis: [{
                                type: 'value',
                                name: '万元',
                                axisTick: false,
                                min: 0,
                                max: 250,
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
                                min: 0,
                                max: 25,
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
                                        color: ['#EEEEEE'],

                                    }
                                }
                            }
                        ],
                        series: [{
                                name: '本年度各月实际支出',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#78B9FF'
                                    }
                                },
                                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                            },
                            {
                                name: '上一年度各月实际支出',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#6DC56E'
                                    }
                                },
                                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                            },
                            {
                                name: '本年度个月使用率',
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
                                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 1.0, 15.5, 22.0, 30]
                            }
                        ]
                    };
                    nhCharts.setOption(modeTools.option2);
                },
                change: function() {
                    this.isHide = !this.isHide;
                },
                closeWindow: function(event) {
                    // nhCharts.setOption()
                }
            }
        });
    });
})();
