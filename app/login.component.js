"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
require('rxjs/Rx');
var LoginComponent = (function () {
    function LoginComponent(builder, http, router) {
        this.http = http;
        this.router = router;
        this.loginForm = builder.group({
            username: [""],
            password: [""]
        });
        if (localStorage.getItem('token') != null) {
            this.router.parent.navigate(['./Home']);
        }
    }
    LoginComponent.prototype.onLogin = function () {
        var _this = this;
        document.getElementById("alert").innerHTML = "";
        document.getElementById("spinner").style.visibility = "visible";
        var postdata = "username=" + this.loginForm.value.username + "&password=" + this.loginForm.value.password;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/login_service.php', postdata, { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("alert").innerHTML = obj;
            document.getElementById("spinner").style.visibility = "hidden";
        }, function () {
            var obj = JSON.parse(data._body);
            localStorage.setItem('token', obj.token);
            localStorage.setItem('username', obj.username);
            _this.router.parent.navigate(['./Home']);
            document.getElementById("spinner").style.visibility = "hidden";
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'my-login',
            templateUrl: 'html/login.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http, router_deprecated_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map