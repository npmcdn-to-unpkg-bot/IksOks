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
var HomeComponent = (function () {
    function HomeComponent(builder, http, router, routeParams) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.routeParams = routeParams;
        router.parent.subscribe(function (val) {
            _this.token = localStorage.getItem('token');
            _this.username = localStorage.getItem('username');
            _this.isAuth = _this.token != null;
        });
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data1;
        this.http.post('../IksOks/php/services/get_players_service.php', "limit=5&sort_by=wins", { headers: headers })
            .subscribe(function (d) { return data1 = d; }, function (err) {
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("spinner-players").style.display = "none";
            document.getElementById("alert-players").innerHTML = obj;
        }, function () {
            //console.log(data1._body);
            _this.players = JSON.parse(data1._body);
            document.getElementById("spinner-players").style.display = "none";
        });
        var data2;
        this.http.post('../IksOks/php/services/get_games_service.php', "limit=5", { headers: headers })
            .subscribe(function (d) { return data2 = d; }, function (err) {
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("spinner-games").style.display = "none";
            document.getElementById("alert-games").innerHTML = obj;
        }, function () {
            //console.log(data2._body);
            _this.games = JSON.parse(data2._body);
            document.getElementById("spinner-games").style.display = "none";
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'my-home',
            templateUrl: 'html/home.component.html',
            directives: [common_1.FORM_DIRECTIVES, router_deprecated_1.ROUTER_DIRECTIVES],
            viewBindings: [common_1.FORM_BINDINGS]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http, router_deprecated_1.Router, router_deprecated_1.RouteParams])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map