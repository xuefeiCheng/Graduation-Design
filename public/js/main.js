/**
 * Created by cxf on 2016/9/26.
 */
angular.module('app')
    .controller("AppCtrl",["$scope","$state",function($scope,$state){
        $scope.$on("USER",function(event,data){
            console.log("ssss");
            console.log(data);
            $scope.$broadcast("child",{data:data})
        });
    }])
    .controller("LoginCtrl",["$scope","$state","$http",function($scope,$state,$http){

    $("#student").keydown(function(event){
        if(event.keyCode ==13){
            $scope.login($scope.stName,$scope.stPsd);
        }
    });
        //$("#user").css("background-color","#B2E0FF");

        //原生js函数写法
        //$("#ps").onmouseover = function () {
        //    this.select();
        //};

        // 用户离开  输入框
        //onblur()  与  blur()的区别
        //js原生          jquery中的
        //注意  函数写法
        // 验证结果
        //function result(id,img,value){
        //    $(id).className=img;
        //    $(id).innerHTML=value;
        //}
        //封装 消息 函数
        function msg (id,result,txt){
            if(result=="wrong"){
                $(id).show();
                $(id).html(txt);
            }else{
                $(id).hide();
                $(id).html(txt);
            }
        }
        //学生登录验证  （页面）
        var stName = $("#stName");
        var teName = $("#teName");
        var leName = $("#leName");

        var stPsd = $("#stPsd");
        var tePsd = $("#tePsd");
        var lePsd = $("#lePsd");

        stName.focus();
        //鼠标悬停 选中文本
        stName.mouseover(function () {
           this.select();
        });
        teName.mouseover(function () {
            this.select();
        });
        leName.mouseover(function () {
            this.select();
        });
        stPsd.mouseover(function () {
            this.select();
        });
        tePsd.mouseover(function () {
            this.select();
        });
        lePsd.mouseover(function () {
            this.select();
        });
        //jquery中的函数  是mouseover

        //页面验证
        function st(){
            stName.blur(function(){
                var txt = this.value;
                if(txt == ""){
                    //console.log("学号不能为空");
                    stName.removeClass("right");
                    stName.focus();
                    stName.addClass("wrong");
                    msg("#result-wrong","wrong","学号不能为空，请重新输入");
                    //show("#result","学号不能为空");
                    //$("#result-wrong").show();
                    //$("#result-wrong").html("学号不能为空，请重新输入");
                    //$("#result").innerHTML="学号不能为空";
                    //userId.attr('placeholder','学号不能为空');
                }else if(isNaN(txt)){
                    stName.removeClass("right");
                    //console.log("学号仅为数字的组合");
                    this.select();
                    stName.addClass("wrong");
                    msg("#result-wrong","wrong","学号仅为数字的组合，请重新输入");
                    //$("#result-wrong").show();
                    //$("#result-wrong").html("学号仅为数字的组合，请重新输入");
                    //userId.attr('placeholder','学号仅为数字的组合');
                }else if(txt.length!=12){
                    stName.removeClass("right");
                    stName.addClass("wrong");
                    msg("#result-wrong","wrong","学号为12位数字组合，请重新输入");
                    //$("#result-wrong").show();
                    //$("#result-wrong").html("学号为12位数字组合，请重新输入");
                    //userId.attr('placeholder','学号为12位数字组合');
                    this.select();
                }
                else{
                    $("#result-wrong").hide();
                    stName.removeClass("wrong");
                    stName.addClass("right");
                }
                //console.log("用户离开输入框了");
            });
        }
        function te(){
            $("#result-wrong").hide();
            stName.removeClass("wrong");
            stName.removeClass("right");
        }
        function le(){
            $("#result-wrong").hide();
        }

        $(function(){
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                // 获取已激活的标签页的名称
                var activeTab = $(e.target).text();
                // 获取前一个激活的标签页的名称
                var previousTab = $(e.relatedTarget).text();
                $(".active-tab span").html(activeTab);
                $(".previous-tab span").html(previousTab);
                switch (activeTab){
                    case "学生登录":
                        stName.focus();
                        //st();
                        break;
                    case "教工登录":
                        //自动聚焦
                        teName.focus();
                        //te();
                        break;
                    case "督评中心登录":
                        leName.focus();
                        break;
                }
            });
        });





        //封装 登录函数
        $scope.login =function(a,b){
            var userId =a;
            var userPsd = b;
            //console.log(userPsd)
            if(a==""|| a==undefined){
                msg("#result-wrong","wrong","用户登录名不能为空，请输入");
                stName.focus();
            }else if(isNaN(a)){
                msg("#result-wrong","wrong","用户登录名仅为数字的组合，请重新输入");
                stName.select();
            }
            else if(b==""|| b==undefined){
                msg("#result-wrong","wrong","用户密码不能为空，请输入");
                stName.focus();
            }else{
                $http({
                    method:'post',
                    //url:'/login',
                    url:'/api/UserLoginController/login',
                    params:{
                        'username':userId,
                        'password':userPsd
                    }
                }).success(function(data){
                    //console.log("登录成功，用户的详细信息为");
                    console.log(data);
                    if(data ==""){
                        msg("#result-wrong","wrong","用户不存在或者密码错误，请检查重新输入");
                        stName.focus();
                        return;
                    }else{
                        $state.go('app.home',{UserId:data.user_id,roleId:data.role.id});
                    }

                })
            }
            //if(ps == null){
            //    alert("密码不能为空");
            //    return ;
            //}
            //if(userId == null){
            //    alert("学号不能为空");
            //    return;
            //}
            //console.log($scope.username);
            //console.log($scope.password);
            //$state.go('app.home');

        }

    }])
    .controller("headerCtrl",function($scope,$state,$http,$stateParams,$rootScope,$injector){
        $scope.$on("child",function(event,data){
            console.log("这是header");
            console.log(data);
        });
        var user;//全局变量 用户的所有信息
        //console.log($stateParams.UserName);
        //由 LoginCtrl 传递过来的参数  可以用于全局的数据绑定
        $rootScope.userxxx=$stateParams.UserId;
        //    根据user_id查询到  权限
        //    根据权限查 function（目录）
        //    $http({
        //        method:'post',
        //        url:'/api/UserLoginController/getUserById',
        //        params:{
        //            'userId':$stateParams.UserId
        //        }
        //    }).success(function(data){
        //            console.log("当前用户权限id"+data.role.id);
        //            var role = data.role.id;
        //通过获取得来的 权限id  获得目录
        $http({
            method:'post',
            url:'/api/UserMenuController/getMenu',
            params:{
                'userId':$stateParams.UserId
            }
        }).success(function(data){
            user = data;
            //console.log("获得用户权限成功");
            //console.log(data);
            $scope.userId = data.userId;
            $scope.userRole = data.roleName;
            $scope.menus = data.menus;
            $scope.roleId = data.roleId;
        });
        //}
        //)
        //修改密码  函数
        function changePsd(userId,newPassword){
            $http({
                method:'post',
                url:'/api/UserMenuController/changePassword',
                params:{
                    'userId':userId,
                    'newPassword':newPassword
                }
            }).success(function(data){
                console.log("修改密码成功");
                $state.go('login');
                //$state.go("login", {}, { reload: true});
                //    跳转到 登录界面
            });
        }
        //清空 弹框 函数
        function clear(a,b,c){
            //$("#password").val("");
            //$("#mpassword").val("");
            //$("#lpassword").val("");
            $(a).val("");
            $(b).val("");
            $(c).val("");
        }
        //关闭  修改密码 弹框
        $scope.closePsd=function(){
            //console.log("清空 弹框内容");
            clear("#password","#mpassword","#lpassword");
            $("#psdMsg").removeClass("psdmsg-wrong","psdmsg-right");
            $("#psdMsg").html("请输入");
            //$("#myModal").hide();
        };
        //修改密码  操作
        $scope.psdSave = function(){
            //console.log(user);
            //console.log($("#psdMsg").attr('class'));
            var currentPsd = $("#password").val();
            var newPsd = $("#mpassword").val();
            var newPsdAgain = $("#lpassword").val();
            var psdMsg = $("#psdMsg");
            //psdMsg.html('点击了修改密码按钮');
            //console.log("点击了修改密码按钮");
            console.log(currentPsd);
            console.log(newPsd);
            console.log(newPsdAgain);
            if(user.psd =="" || newPsd=="" ||newPsdAgain==""){
                psdMsg.removeClass("psdmsg-right").addClass("psdmsg-wrong");
                psdMsg.html('输入不能为空');
            }else if(user.psd != currentPsd ){
                psdMsg.removeClass("psdmsg-right").addClass("psdmsg-wrong");
                psdMsg.html('旧密码输入不正确');
                clear("#password");
                $("#password").focus();
            }else if(newPsd !==newPsdAgain){
                psdMsg.removeClass("psdmsg-right").addClass("psdmsg-wrong");
                psdMsg.html('新密码两次输入不一致');
                clear("#mpassword","#lpassword");
                $("#mpassword").focus();
            }else{
                psdMsg.removeClass("psdmsg-wrong").addClass("psdmsg-right");
                psdMsg.html('新密码验证成功，稍后跳转至登录界面，请重新登录');
                //设置定时器
                setTimeout(function(){
                    $("#myModal").modal("hide");
                    //模态框 隐藏后 遮罩层 还在 在html文件中 出现<div class="modal-backdrop fade in"></div>
                    //解决办法是 需要 调用一下刷新函数
                    //全部清除 方法一 ：在控制器中 加入$injector 服务 ，然后调用
                    //方法二 在路由配置文件中 加入监听 路由状态更改 则 刷新一次
                    //$injector.get('$templateCache').removeAll();
                    changePsd(user.userId,newPsd);
                },3000);
                //setTimeout(changePsd(user.userId,newPsd),6000);
                //time时间过后在运行

            }
            //changePassword()
            //    当前密码 currentPsd
            //    新密码 newPsd
            //    再次确认新密码 newPsdAgain
        }
    })
    .controller("homeCtrl",function($scope,$state,$http,$stateParams){
        //console.log($stateParams.UserName);
        var userId=$stateParams.UserId;
        console.log("home");
        console.log(userId);
        $scope.$emit("USER",{data:$stateParams.UserId});
        $scope.$on("child",function(event,data){
            console.log("这是home");
            console.log(data);
        })

    })
    .controller("infoCtrl",function($scope,$http,$stateParams,$rootScope,$state){
    //    控制器之间 传递的参数  为  用户id 用户的权限
    //    根据权限 查不同角色的表
    //    显示具体的 角色的信息
    //    console.log("这是个人信息");
    //    console.log($stateParams.UserId);
        //问题：为什么 同样都是appCtrl的子控制器 只有headerCtrl能够接受到 父控制器的广播
        //页面加载之后  在F12中 ui-view 那是没有controller的
        //是不是因为这个原因呢 毕竟在该结果中 只有headerCtrl是写死在页面中的
        //要怎么解决呢？？？？？
        $rootScope.$on("child",function(event,data){
            console.log(data);
        });
    //    由于 每一个目录 都会用到 userId  所以用了一个 取巧的办法 直接在路径渲染后面加了 userId

    //    获得权限 id
    //    var roleId = $stateParams.roleId;
    //    console.log(typeof roleId);//String
        var roleId = parseInt($stateParams.roleId);
        console.log(typeof roleId);//nummber
        info(roleId);

    //    根据 权限 加载相应的函数
        function info(role){
            switch (role){
                case 1:getStudentJson();
                    //    视图 全部消失
                    hideAll("#teacher","#leader","#admin");
                    //更改 学生个人信息 并保存
                    $scope.save= function(){
                        changeInfo_st();
                    };
                    break;
                case 2:
                    getTeacherJson();
                    hideAll("#student","#leader","#admin");
                    $scope.save= function(){
                        changeInfo_te();
                    };
                    break;
                case 3:getLeaderJson();
                    //    视图 全部消失
                    hideAll("#student","#teacher","#admin");
                    //更改 督导个人信息 并保存
                    $scope.save= function(){
                        changeInfo_le();
                    };
                    break;
                case 4:
                    getAdminJson();
                    hideAll("#student","#teacher","#leader");
                    //更改 学生个人信息 并保存
                    $scope.save= function(){
                        changeInfo_ad();
                    };
                    break;
            }
        }
    //函数 封装
    //    全部消失
        function hideAll(a,b,c,d){
            $(a).hide();
            $(b).hide();
            $(c).hide();
            $(d).hide();
        }
        //    获得  学生 个人信息
        function getStudentJson(){
            $http({
                method:'post',
                url:'/api/UserInfo/getStudentJson',
                params:{
                    'userId':$stateParams.UserId
                }
            }).success(function(data){
                //console.log(data);
                $scope.user = data;
            });
            $scope.goSub=function(){
                $state.go("app.information.edit-do");
            };
        }
        //更改学生信息
        function changeInfo_st(){
            $http({
                method:"post",
                url:"/api/UserInfo/changeInfo_st",
                params:{
                    "userId":$stateParams.UserId,
                    "email":$scope.user.email,
                    'dz':$scope.user.dz,
                    'phone':$scope.user.phone
                }
            }).success(function(data){
                //console.log("保存成功");
                //console.log(data);
                //跳转页面 并且 刷新页面 显示新数据
                //跳转到该路由下 会再一次 调用 该控制器 所以 会刷新一次
                //不用自己手动调用一次函数 刷新页面了
                $state.go("app.information.edit");
            })
        }

        //获得管理员个人信息
        function getAdminJson(){
            $http({
                method:'post',
                url:'/api/UserInfo/getAdminJson',
                params:{
                    'userId':$stateParams.UserId
                }
            }).success(function(data){
                //console.log(data);
                $scope.user = data;
            });
            $scope.goSub=function(){
                $state.go("app.information.edit-do");
            };
        }
        //更改 管理员信息
        function changeInfo_ad(){
            $http({
                method:"post",
                url:"/api/UserInfo/changeInfo_ad",
                params:{
                    "userId":$stateParams.UserId,
                    "email":$scope.user.email,
                    'dz':$scope.user.dz,
                    'phone':$scope.user.phone
                }
            }).success(function(data){
                //console.log("保存成功");
                //console.log(data);
                //跳转页面 并且 刷新页面 显示新数据
                //跳转到该路由下 会再一次 调用 该控制器 所以 会刷新一次
                //不用自己手动调用一次函数 刷新页面了
                $state.go("app.information.edit");
            })
        }


        //获得 教师 个人信息
        function getTeacherJson(){
            $http({
                method:'post',
                url:'/api/UserInfo/getTeacherJson',
                params:{
                    'userId':$stateParams.UserId
                }
            }).success(function(data){
                console.log(data);
                $scope.user = data;
            });
        }

        //更改教师信息
        function changeInfo_te(){
            $http({
                method:"post",
                url:"/api/UserInfo/changeInfo_te",
                params:{
                    "userId":$stateParams.UserId,
                    "email":$scope.user.email,
                    'dz':$scope.user.dz,
                    'phone':$scope.user.phone
                }
            }).success(function(data){
                //console.log("保存成功");
                //console.log(data);
                //跳转页面 并且 刷新页面 显示新数据
                //跳转到该路由下 会再一次 调用 该控制器 所以 会刷新一次
                //不用自己手动调用一次函数 刷新页面了
                $state.go("app.information.edit");
            })
        }

        //获得 督导 个人信息
        function getLeaderJson(){
            $http({
                method:'post',
                url:'/api/UserInfo/getLeaderJson',
                params:{
                    'userId':$stateParams.UserId
                }
            }).success(function(data){
                console.log(data);
                $scope.user = data;
            });
        }

        //更改 督导个人信息
        function changeInfo_le(){
            $http({
                method:"post",
                url:"/api/UserInfo/changeInfo_le",
                params:{
                    "userId":$stateParams.UserId,
                    "email":$scope.user.email,
                    'dz':$scope.user.dz,
                    'phone':$scope.user.phone
                }
            }).success(function(data){
                //console.log("保存成功");
                //console.log(data);
                //跳转页面 并且 刷新页面 显示新数据
                //跳转到该路由下 会再一次 调用 该控制器 所以 会刷新一次
                //不用自己手动调用一次函数 刷新页面了
                $state.go("app.information.edit");
            })
        }


        $scope.goSub=function(){
            $state.go("app.information.edit-do");
        };
    })
    .controller("PingTeCtrl",function($scope,$http,$stateParams){
    //    根据id 获得 课程list
    //    学生 id 为 $stateParams.UserId
    //    alert("这是 评教页面");
        //console.log(typeof $stateParams.UserId);


        $http({
            method:"post",
            url:"/api/getListController/getCoursesListByStudent",
            params:{
                "stId":$stateParams.UserId
            }
        }).success(function(data){
            //console.log("获取数据成功");
            console.log(data);
            $scope.data = data;
        });





    })
    .controller("PingTeDetailCtrl",function($scope,$http,$stateParams){
//        课程id 为 $stateParams.courseId
//        根据 课程id 查到课程表数据
//        学生id为$stateParams.UserId
//        老师id为$stateParams.TeId 或者是 下面http服务请求的数据里 data.te_id
        console.log($stateParams.UserId);
        $http({
            method:"post",
            url:"/api/getListController/getCourseJson",
            params:{
                "co_id":$stateParams.courseId
            }
        }).success(function(data){
            //console.log("获取数据成功");
            console.log(data);
            $scope.courseName = data.name;
            //$scope.data = data;
        });
//    教师 id 为 $stateParams.TeId
        //    根据 教师id 返回教师 的某些信息
        //    调用的是  教师module中的方法
        //console.log($stateParams.courseId);
        $http({
            method:"post",
            url:"/api/UserInfo/getTeacherJson",
            params:{
                "userId":$stateParams.TeId
            }
        }).success(function(data){
            //console.log("获取数据成功");
            console.log(data);
            $scope.teacher = data;
            //$scope.data = data;
        });
    //    评教页面 选择项目
        $scope.pingjia = [{
            value : 5,
            name : "优秀"
        },{
            value : 4,
            name : "良好"
        },{
            value : 3,
            name : "中等"
        },{
            value : 1,
            name : "差强人意"
        }];
    //   评教 获得 分数
        var value1,value2,value3,value4,value5,value6,value7,value8,value9,value10;
        $scope.getValue1 = function(val){
            value1= val;
        };$scope.getValue2 = function(val){
            value2= val;
        };$scope.getValue3 = function(val){
            value3= val;
        };$scope.getValue4 = function(val){
            value4= val;
        };$scope.getValue5 = function(val){
            value5= val;
        };$scope.getValue6 = function(val){
            value6= val;
        };$scope.getValue7 = function(val){
            value7= val;
        };$scope.getValue8 = function(val){
            value8= val;
        };$scope.getValue9 = function(val){
            value9= val;
        };$scope.getValue10 = function(val){
            value10= val;
        };
        $scope.submit = function(){
            //页面验证 值不能为空 出现弹框
            //获得 对老师的评语
           console.log($scope.text) ;
            console.log(value1,value2);
        //    数据保存到数据库表中 当学生点击提交之后
        //    课程列表的 状态变为 已评状态 评教表单 展示的是 学生评教的数据 并且 不再支持编辑功能
        //    只要将 提交按钮的状态设置为不可点击即可
        //    disabled
        //    $("#fat-btn").attr("disabled",true);
            if(value1==undefined ||value2 == undefined ||value3 == undefined ||value4 == undefined ||value5 == undefined
                ||value6 == undefined ||value7== undefined ||value8 == undefined ||value8 == undefined||value10 == undefined){
                $("#fat-btn").html("表单中含有未填项，请检查填写后再次提交");
                $("#fat-btn").removeClass("btn-primary").addClass("btn-danger");
            }else{
                //开始调用接口 用于 将评价报存到 教师结果表中
                $http({
                    method: "post",
                    url: "/api/InfoSave/teacherResultSet",
                    params: {
                        "coId": $stateParams.courseId,
                        "stId": $stateParams.UserId,
                        "p1": value1,
                        "p2": value2,
                        "p3": value3,
                        "p4": value4,
                        "p5": value5,
                        "p6": value6,
                        "p7": value7,
                        "p8": value8,
                        "p9": value9,
                        "p10": value10,
                        "content": $scope.text
                    }
                }).success(function(data){
                    console.log("评教成功");
                    //需要 改变一下 学生 课程link表中的状态
                    //然后通知一下 父控制器 刷新一下界面的 课程旁边的状态展示
                    $("#fat-btn").html("提交成功，无法再次编辑");
                    $("#fat-btn").removeClass("btn-primary btn-danger").addClass("disabled");
                });

            }

        }

    })
    .controller("PingStCtrl",function($scope,$http,$stateParams){
        $scope.$on("status",function(event){
            //alert("状态要更改了");
            getCoursesListByTeacher();
        });
        //教师 id 为 $stateParams.UserId
        console.log($stateParams.UserId);
    //    根据 教师 id 查 课程表 返回 课程 信息
        getCoursesListByTeacher();
        function getCoursesListByTeacher(){
            $http({
                method:"post",
                url:"/api/getListController/getCoursesListByTeacher",
                params:{
                    "userId":$stateParams.UserId
                }
            }).success(function(data){
                console.log("获取数据成功");
                console.log(data);
                $scope.data = data;
            });
        }
    })
    .controller("studentListCtrl",function($scope,$http,$stateParams){
        $scope.courseId =$stateParams.courseId;
        //    根据 课程 id 查 课程学生link表 返回 学生 信息
        $http({
            method:"post",
            url:"/api/getListController/getStudentListByCourse",
            params:{
                "coId":$stateParams.courseId
            }
        }).success(function(data){
            //console.log("获取数据成功");
            console.log(data);
            $scope.data = data;
        });
    })
    .controller("PingStDetailCtrl",function($scope,$http,$stateParams){
        //console.log($stateParams.stId);
    //    课程id 为$stateParams.courseId
    //    学生id 为$stateParams.stId
    //    通过学生id 查找学生信息 调用 学生module中的方法
    //    $http({
    //        method:"post",
    //        url:"/api/UserInfo/getStudentJson",
    //        params:{
    //            "userId":$stateParams.stId
    //        }
    //    }).success(function(data){
    //        console.log("学生信息");
    //        console.log(data);
    //        $scope.student = data;
    //    })

    //    根据 课程id 查找课程表 返回 课程信息
        $http({
            method:"post",
            url:"/api/getListController/getCourseJson",
            params:{
                "co_id":$stateParams.courseId
            }
        }).success(function(data){
            console.log("课程信息");
            console.log(data);
            $scope.co = data;
            var status =data.status;
            //console.log(status)
            switch (status){
                case 1:
                    //alert("状态为 已评");
                    $("#fat-btn").html("提交成功，无法再次编辑");
                    $("#fat-btn").removeClass("btn-primary btn-danger").addClass("disabled");
                    //调用 courseResult表中 方法
                    //传入 courseid 获得数据
                    $http({
                        method:"post",
                        url:"/api/getListController/getCourseResultByCoId",
                        params:{
                            "cooId":$stateParams.courseId
                        }
                    }).success(function(data){
                        console.log(data);
                        $scope.p11 = data.p1;
                        $scope.p22 = data.p2;
                        $scope.p33 = data.p3;
                        $scope.p44 = data.p4;
                        $scope.p55 = data.p5;
                        $scope.p66 = data.p6;
                        $scope.p77 = data.p7;
                        $scope.p88 = data.p8;
                        $scope.p99 = data.p9;
                        $scope.p100 = data.p10;
                        $scope.text = data.content;
                    });
                    break;
                case 0:
                    $("#fat-btn").html("提交评学表单");
                    $("#fat-btn").removeClass("btn-primary btn-danger disabled").addClass("btn-primary");
                    //alert("状态为 未评");
                    break;
            }

        });
        //if course.status =0
        // 调用 更改库表 方法
        //else 调用的是 查询 courseResult表 数据方法


        //评教页面 选择项目
        $scope.pingjia = [{
            value : 5,
            name : "优秀"
        },{
            value : 4,
            name : "良好"
        },{
            value : 3,
            name : "中等"
        },{
            value : 1,
            name : "差强人意"
        }];
        //   评教 获得 分数
        var value1,value2,value3,value4,value5,value6,value7,value8,value9,value10;
        $scope.getValue1 = function(val){
            value1= val;
        };$scope.getValue2 = function(val){
            value2= val;
        };$scope.getValue3 = function(val){
            value3= val;
        };$scope.getValue4 = function(val){
            value4= val;
        };$scope.getValue5 = function(val){
            value5= val;
        };$scope.getValue6 = function(val){
            value6= val;
        };$scope.getValue7 = function(val){
            value7= val;
        };$scope.getValue8 = function(val){
            value8= val;
        };$scope.getValue9 = function(val){
            value9= val;
        };$scope.getValue10 = function(val){
            value10= val;
        };
        $scope.submit = function(){
            //页面验证 值不能为空 出现弹框
            //获得 对老师的评语
            console.log($scope.text) ;
            console.log(value1,value2);
            //    数据保存到数据库表中 当学生点击提交之后
            //    课程列表的 状态变为 已评状态 评教表单 展示的是 学生评教的数据 并且 不再支持编辑功能
            //    只要将 提交按钮的状态设置为不可点击即可
            //    disabled
            //    $("#fat-btn").attr("disabled",true);
            if(value1==undefined ||value2 == undefined ||value3 == undefined ||value4 == undefined ||value5 == undefined
                ||value6 == undefined ||value7== undefined ||value8 == undefined ||value8 == undefined||value10 == undefined){
                $("#fat-btn").html("表单中含有未填项，请检查填写后再次提交");
                $("#fat-btn").removeClass("btn-primary").addClass("btn-danger");
            }else{
                //请求 方法 保存
                //调用的是 courseResult表中的SetResult方法
                //传递的参数含有 该课程的id 以及 评价项
                $http({
                    method:"post",
                    url:"/api/InfoSave/CourseResultSet",
                    params:{
                        "coId":$stateParams.courseId,
                        "p1":value1,
                        "p2":value2,
                        "p3":value3,
                        "p4":value4,
                        "p5":value5,
                        "p6":value6,
                        "p7":value7,
                        "p8":value8,
                        "p9":value9,
                        "p10":value10,
                        "content":$scope.text
                    }
                }).success(function(data){
                    //成功之后 调用一下 course表的方法 变更状态 并且消息传递给 父级控制器 刷新一下 页面
                    console.log(data);
                    $http({
                            method: "post",
                            url: "/api/InfoSave/statusChange",
                            params: {
                                "coId": $stateParams.courseId
                            }
                        }).success(function(data){
                        //传递消息
                        console.log("状态更改完毕");
                        console.log(data);
                        $scope.$emit('status');
                    })
                });
                $("#fat-btn").html("提交成功，无法再次编辑");
                $("#fat-btn").removeClass("btn-primary btn-danger").addClass("disabled");
            }

        }
    })
    .controller("stResultCtrl",function($scope,$http,$stateParams){
    //    根据 学生id 查找 学生 课程link表格 查出 本学期的课程
        $http({
            method:"post",
            url:"/api/getListController/getCoursesListByStudent",
            params:{
                "stId":$stateParams.UserId
            }
        }).success(function(data){
            console.log("本学期课程list");
            console.log(data);
            $scope.data = data;
        });

    })
    .controller("stReDetailCtrl",function($scope,$http,$stateParams){
    //    根据课程id 查找的是 课程result表 中的数据
        //评教页面 选择项目
        $scope.pingjia = [{
            value : 5,
            name : "优秀"
        },{
            value : 4,
            name : "良好"
        },{
            value : 3,
            name : "中等"
        },{
            value : 1,
            name : "差强人意"
        }];

        $http({
            method:"post",
            url:"/api/getListController/getCourseJson",
            params:{
                "co_id":$stateParams.courseId
            }
        }).success(function(data){
            console.log("课程信息");
            console.log(data);
            $scope.co = data;
            var status = data.status;
            if(status == 0){
                $scope.p11 = 5;
                $scope.p22 = 5;
                $scope.p33 = 5;
                $scope.p44 = 5;
                $scope.p55 = 5;
                $scope.p66 = 5;
                $scope.p77 = 5;
                $scope.p88 = 5;
                $scope.p99 = 5;
                $scope.p100 = 5;
                $scope.text = "老师还没有评论哦";
            }else{
                $http({
                    method:"post",
                    url:"/api/getListController/getCourseResultByCoId",
                    params:{
                        "cooId":$stateParams.courseId
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.p11 = data.p1;
                    $scope.p22 = data.p2;
                    $scope.p33 = data.p3;
                    $scope.p44 = data.p4;
                    $scope.p55 = data.p5;
                    $scope.p66 = data.p6;
                    $scope.p77 = data.p7;
                    $scope.p88 = data.p8;
                    $scope.p99 = data.p9;
                    $scope.p100 = data.p10;
                    $scope.text = data.content;
                });
            }
        });

    })
    .controller("teResultCtrl",function($scope,$http,$stateParams){
        getCoursesListByTeacher();
        function getCoursesListByTeacher(){
            $http({
                method:"post",
                url:"/api/getListController/getCoursesListByTeacher",
                params:{
                    "userId":$stateParams.UserId
                }
            }).success(function(data){
                console.log("获取数据成功");
                console.log(data);
                $scope.data = data;
            });
        }
    })
    .controller("teReDetailCtrl",function($scope,$http,$stateParams){})