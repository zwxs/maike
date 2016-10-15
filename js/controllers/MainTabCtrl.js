define(['app'],function (app){
    'use strict';
    function ctrl ($scope,$state,$stateParams,$ionicLoading,$ionicSlideBoxDelegate,$ionicScrollDelegate,$timeout, $ionicPopover,homeServices){
            
            $scope.task={title:'广州市 萝岗区 万达商城...'};
            //下拉刷新
            $scope.doRefresh = function() {
                $http.get('./data/refresh.json')   //注意改为自己本站的地址，不然会有跨域问题
                .success(function(data) {
                    $scope.tasks = data;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            //上拉加载更多
            $scope.loadMore = function(){

            }
        // init the popover
            $ionicPopover.fromTemplateUrl('button-options.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });

            $scope.openPopover = function ($event, type) {
                $scope.type = type;
                $scope.popover.show($event);
            };

            $scope.closePopover = function () {
                $scope.popover.hide();
                // if you are navigating away from the page once
                // an option is selcted, make sure to call
                // $scope.popover.remove();
            };
        //回到顶部
        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop(true);
        };
        // console.log("$ionicScrollDelegate.getScrollPosition()",$ionicScrollDelegate.getScrollPosition);
        //首页banner数据
        $ionicLoading.show({
                template: "正在载入数据，请稍后..."
            });
        $timeout(function(){
        homeServices.getbanner().then(function (data){
            $scope.banner = data;

            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        },function (error){
            $ionicLoading.hide();
            // console.log(error);
        });
        },2000);
        //首页商品数据
        homeServices.getGoodslistAll().then(function (data){
            $scope.textGoodslistAll = data;
        },function (error){
            // console.log(error);
        });
        
        $scope.inMap=function(){
            $state.go('baidumap');
        }
    } 
    ctrl.$inject = ['$scope','$state','$stateParams','$ionicLoading','$ionicSlideBoxDelegate','$ionicScrollDelegate','$timeout', '$ionicPopover','homeServices'];
    app.registerController('MainTabCtrl',ctrl);
})