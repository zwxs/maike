define(['app'], function (app){
    'use strict';
    function ctrl ($scope,$ionicModal,$ionicPopup,$rootScope,$timeout,$state,$ionicSlideBoxDelegate,Popup,ShopingcartServices,joincartServices,shopCartDataService,passDataService){
        $scope.backhome=function(){
                $state.go('tab.tab1');
            }
            //获取购物车列表数据            
            var promise = ShopingcartServices.getallorders();
            promise.then(function (data){
                Popup.notice('加载中...', 3000, function () {
                    // console.log('error!');
                });
                $scope.items=data;
                // 计算购物车开始
                $scope.myCart=true;
                //checkbox
                var len = $scope.items.length;
                $scope.choseArr=[];//定义数组用于存放前端显示
                $scope.ly_total=0;
                var str="";//
                var flag='';//是否点击了全选，是为a
                $scope.x=false;//默认未选中
                var flagbull=[]; //选中与否
                for (var j = 0; j < len; j++) {
                    flagbull.push(false);
                }
                // console.log("flagbull",flagbull);
                $scope.all= function (c,$index) {//全选
                    console.log("itemsslsdl",$scope.items)
                    // console.log("master",c)
                    if(c==true){
                        $scope.x=true;
                
                        $scope.varlist.total = 0;
                        for (var j = 0; j < len; j++) {
                            $scope.varlist.total = $scope.varlist.total + $scope.items[j].num * $scope.items[j].nowprice;
                            flagbull[j]=true;
                        }
                        $scope.ly_total=$scope.varlist.total;
                    }else{
                        $scope.x=false;
                        $scope.choseArr=[""];
                        $scope.ly_total=$scope.varlist.total=0;
                         for (var j = 0; j < len; j++) {
                            flagbull[j]=false;
                        }
                    }
                    // console.log('$scope.x',$scope.x);
                    flag='a';
                };
                $scope.chk= function ($index,x) {//单选或者多选
                    // console.log("$scope.items[$index].nowprice",$scope.items[$index].nowprice);
                    if(flag=='a') {//在全选的基础上操作
                        str = $scope.choseArr.join(',') + ',';
                    }
                    if (x == true) {//选中
                        str = str + $scope.items[$index].id + ',';
                        getTotal($index);
                        flagbull[$index]=true;
                    } else {
                        str = str.replace($scope.items[$index].id + ',','');//取消选中
                        ReduceTotal($index);
                        flagbull[$index]=false;
                    }
                    // $scope.choseArr=(str.substr(0,str.length-1)).split(',');
                    $scope.choseArr=str;
                    console.log("$scope.choseArr",$scope.choseArr);
                    
                    $scope.ly_total=$scope.varlist.total;
                };

                //checkbox
                $scope.remove=function($index){
                    Popup.confirm('确定删除？', function () {
                        // console.log("yes");
                        // console.log("$index",$index);
                        // console.log('allremoveflagbull',flagbull)
                        // console.log('removeflagbull',flagbull[$index]);
                        if(flagbull[$index] == true){
                            $scope.varlist.total = $scope.varlist.total - $scope.items[$index].num * $scope.items[$index].nowprice;
                            $scope.ly_total=$scope.varlist.total;
                        }
                        $scope.items.splice($index,1);
                        //向后台发送删除接口
                        ShopingcartServices.deleteorders().then(function (data){

                        },function (error){
                            
                        })
                        // console.log('$scope.itemss',$scope.items);
                        // console.log('$scope.items',$scope.items.length);
                    }, function () {
                        // console.log("no")

                    });
                    
                }

                // 检测是否变化，为了总价能够改变
                // $scope.$watch("items.num", function() {
                //     getTotal();
                // }, true);
                // 定义变量

                $scope.varlist = {
                    total: 0
                }
                // 购物的时候操作
                $scope.buy = function($index) {
                    $scope.items[$index].num++;
                    getTotal();
                }
                // -----
                $scope.minus = function($index) {
                    if ($scope.items[$index].num == 0 || flagbull[$index] == false) {
                        return;
                    } else {
                        joincartServices.joincartbase($scope.items[$index].itemId,$scope.items[$index].num).then(function (data){
                            $scope.items[$index].num--;
                            $scope.varlist.total-= $scope.items[$index].nowprice;
                            $scope.ly_total=$scope.varlist.total;
                        },function (error){
                            Popup.notice('网络错误', 3000, function () {
                                // console.log('error!');
                            });
                        })

                        
                    }
                }
                // ++++
                $scope.add = function($index) {
                    if(flagbull[$index] == false){
                        return;
                    }else{
                        joincartServices.joincartbase($scope.items[$index].itemId,$scope.items[$index].num).then(function (data){
                            $scope.items[$index].num++;
                            $scope.varlist.total+= $scope.items[$index].nowprice;
                            $scope.ly_total=$scope.varlist.total;
                        },function (error){
                            Popup.notice('网络错误', 3000, function () {
                                // console.log('error!');
                            });
                        })
                    }
                }
                // 计算总价
                var getTotal = function($index) {
                    console.log("itemss",$scope.items);
                    console.log("$index",$index);
                    // console.log('flag',flag);
                    // console.log("hou$scope.items[$index].nowprice;",$scope.items[$index].nowprice);
                    // console.log("hou$scope.items[$index].num;",$scope.items[$index].num);
                    $scope.varlist.total = $scope.varlist.total + $scope.items[$index].num * $scope.items[$index].nowprice;
                    // for (var j = 0; j < len; j++) {
                    //     $scope.varlist.total = $scope.varlist.total + $scope.items.num[j] * $scope.items[j].nowprice;
                    // }
                    return $scope.varlist.total;
                }
                var ReduceTotal = function($index) {
                    // console.log('Reduceflag',flag);
                    // console.log("Reducehou$scope.items[$index].nowprice;",$scope.items[$index].nowprice);
                    // console.log("Reducehou$scope.items[$index].num;",$scope.items[$index].num);
                    $scope.varlist.total = $scope.varlist.total - $scope.items[$index].num * $scope.items[$index].nowprice;
                    // for (var j = 0; j < len; j++) {
                    //     $scope.varlist.total = $scope.varlist.total + $scope.items.num[j] * $scope.items[j].nowprice;
                    // }
                    return $scope.varlist.total;
                }
                // 计算购物车结束
            },function (error){
                Popup.notice('网络错误', 3000, function () {
                    // console.log('error!');
                });
            })
            $scope.account=function(ly_total){
                if(ly_total == 0){
                    Popup.notice('您还没有选择商品哦!',3000,function(){
                        // console.log("slj");
                    })
                }else{
                    ShopingcartServices.getcreateorder($scope.choseArr).then(function (data){
                        $rootScope.all_tmpData = data;
                        $state.go('tab.order');
                    },function (error){

                    })
                }

            }
            // $scope.items=[{id:0,title:'海尔冰箱',nowprice:1,originalnowPrice:1995,num:1},
            //             {id:1,title:'长虹电视',nowprice:2,originalnowPrice:2995,num:2},
            //             {id:2,title:'电饭锅',nowprice:3,originalnowPrice:395,num:3},
            //             {id:3,title:'长虹电视',nowprice:2,originalnowPrice:2995,num:4},]
    }
    ctrl.$inject = ['$scope','$ionicModal','$ionicPopup','$rootScope','$timeout','$state','$ionicSlideBoxDelegate','Popup','ShopingcartServices','joincartServices','shopCartDataService','passDataService'];
    app.registerController('ShopingCartCtrl',ctrl);
})