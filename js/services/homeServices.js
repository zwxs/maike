define([],function () {
    "use strict";
    var factory = function ($http,$q,baseUrl) {
        function textljz(){
            return ljzh = "ljzqwer";
        }
        return {
            // //示例
            // getGameData: function(gameId) {
            //         var deferred = $q.defer();
            //         var url = "http://m?id="+gameId;
            //         url+="&callback=JSON_CALLBACK";
            //         $http.jsonp(url).success(function (data) {
            //           //业务处理
            //           deferred.resolve(data.data);
            //         }).error(function (error) {
            //           //业务处理
            //           deferred.reject(error)
            //         })
            //         return deferred.promise;
            //       }
            //     };
            //首页 大图
            getbanner:function(){
                var deferred = $q.defer();
                var url = baseUrl + "banner/bannerInfo.action";
                url += "?callback=JSON_CALLBACK";
                $http.jsonp(url).success(function (data){
                    var data = data;
                    console.log("databanner",data);
                    deferred.resolve(data);
                }).error(function (error){
                    console.log("error",error);
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            //首页产品
            getGoodslistAll:function(){
                var deferred = $q.defer();
                var url = baseUrl + "item/storeItemList.action?condition.vmCode=&condition.label=2";
                url += "&callback=JSON_CALLBACK";
                $http.jsonp(url).success(function (data){
                    var data = data;
                    console.log("goodslistAll",data);
                    deferred.resolve(data);
                }).error(function (error){
                    deferred.reject(error);
                })
                return deferred.promise;
            }

        }
    }
    factory.$inject = ['$http','$q','baseUrl'];
    return factory;
})
