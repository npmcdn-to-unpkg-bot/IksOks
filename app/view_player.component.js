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
var ViewPlayerComponent = (function () {
    function ViewPlayerComponent(builder, http, router, routeParams) {
        this.http = http;
        this.router = router;
        this.routeParams = routeParams;
        this.playerId = parseInt(this.routeParams.get('id'));
        this.player = "";
        this.challenging = false;
        this.isAuth = localStorage.getItem('token') != null;
    }
    ViewPlayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data1;
        this.http.post('../IksOks/php/services/get_player_service.php', "id=" + this.playerId, { headers: headers })
            .subscribe(function (d) { return data1 = d; }, function (err) {
            var obj = JSON.parse(err._body);
            document.getElementById("alert-player").innerHTML = obj;
            document.getElementById("spinner-player").style.display = "none";
        }, function () {
            //console.log(data1._body);
            _this.player = JSON.parse(data1._body);
            document.getElementById("spinner-player").style.display = "none";
            document.getElementById("playerinfo").style.display = "block";
        });
        var data2;
        this.http.post('../IksOks/php/services/get_games_service.php', "player_id=" + this.playerId, { headers: headers })
            .subscribe(function (d) { return data2 = d; }, function (err) {
            var obj = JSON.parse(err._body);
            document.getElementById("alert-games").innerHTML = obj;
            document.getElementById("spinner-game").style.display = "none";
        }, function () {
            //console.log(data2._body);
            _this.games = JSON.parse(data2._body);
            document.getElementById("spinner-games").style.display = "none";
            document.getElementById("playerinfo").style.display = "block";
        });
    };
    ViewPlayerComponent.prototype.challenge = function (sign) {
        var _this = this;
        if (this.challenging) {
            return;
        }
        this.challenging = true;
        document.getElementById("spinner").style.display = "block";
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var postdata = "player2_id=" + this.playerId + "&sign=" + sign;
        var data;
        this.http.post('../IksOks/php/services/new_game_service.php', postdata, { headers: headers })
            .subscribe(function (d) {
            data = d;
            console.log(data);
        }, function (err) {
            var obj = JSON.parse(err._body);
            document.getElementById("alert").innerHTML = obj;
            document.getElementById("spinner").style.display = "none";
            _this.challenging = false;
        }, function () {
            //console.log(data._body);
            var game = JSON.parse(data._body);
            _this.router.root.navigate(['./Play', { id: game.id }]);
            document.getElementById("spinner").style.display = "none";
            _this.challenging = false;
        });
    };
    ViewPlayerComponent = __decorate([
        core_1.Component({
            selector: 'my-view-player',
            templateUrl: 'html/view_player.component.html',
            directives: [common_1.FORM_DIRECTIVES, router_deprecated_1.ROUTER_DIRECTIVES],
            viewBindings: [common_1.FORM_BINDINGS]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http, router_deprecated_1.Router, router_deprecated_1.RouteParams])
    ], ViewPlayerComponent);
    return ViewPlayerComponent;
}());
exports.ViewPlayerComponent = ViewPlayerComponent;
//# sourceMappingURL=view_player.component.js.map