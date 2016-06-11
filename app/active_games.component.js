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
var ActiveGamesComponent = (function () {
    function ActiveGamesComponent(builder, http, router, routeParams) {
        this.http = http;
        this.router = router;
        this.routeParams = routeParams;
        this.userId = localStorage.getItem('token');
    }
    ActiveGamesComponent.prototype.ngOnInit = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_active_games_service.php', "", { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("alert").innerHTML = obj;
            document.getElementById("spinner").style.display = "none";
        }, function () {
            //console.log(data._body);
            _this.games = JSON.parse(data._body);
            document.getElementById("spinner").style.display = "none";
        });
    };
    ActiveGamesComponent = __decorate([
        core_1.Component({
            selector: 'my-active-games',
            templateUrl: 'html/active_games.component.html',
            directives: [common_1.FORM_DIRECTIVES, router_deprecated_1.ROUTER_DIRECTIVES],
            viewBindings: [common_1.FORM_BINDINGS]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http, router_deprecated_1.Router, router_deprecated_1.RouteParams])
    ], ActiveGamesComponent);
    return ActiveGamesComponent;
}());
exports.ActiveGamesComponent = ActiveGamesComponent;
//# sourceMappingURL=active_games.component.js.map