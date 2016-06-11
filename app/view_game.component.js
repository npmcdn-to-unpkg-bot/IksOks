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
var ViewGameComponent = (function () {
    function ViewGameComponent(builder, http, router, routeParams) {
        this.http = http;
        this.router = router;
        this.routeParams = routeParams;
        this.gameId = parseInt(this.routeParams.get('id'));
    }
    ViewGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_game_service.php', "id=" + this.gameId, { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            var obj = JSON.parse(err._body);
            document.getElementById("spinner").style.display = "none";
            document.getElementById("alert").innerHTML = obj;
        }, function () {
            //console.log(data._body);
            _this.game = JSON.parse(data._body);
            _this.refreshBoard();
            document.getElementById("spinner").style.display = "none";
            document.getElementById("gamepanel").style.display = "block";
        });
    };
    ViewGameComponent.prototype.refreshBoard = function () {
        for (var i = 0; i < 9; ++i) {
            var src = "";
            if (this.game.board.charAt(i) == 'x') {
                src = "res/play_x.svg";
            }
            else if (this.game.board.charAt(i) == 'o') {
                src = "res/play_o.svg";
            }
            document.getElementById("grid" + i).src = src;
        }
        var end = this.checkEnd();
        if (end) {
            this.winner = this.game.board.charAt(end[0] + end[1] * 3);
            var line = document.getElementById("victory-line");
            line.style.stroke = this.winner == 'x' ? "#0971B2" : "#B21212";
            line.setAttribute('x1', 10 + end[0] * 20);
            line.setAttribute('y1', 10 + end[1] * 20);
            line.setAttribute('x2', 10 + end[2] * 20);
            line.setAttribute('y2', 10 + end[3] * 20);
            document.getElementById("victory-img").style.display = "block";
        }
    };
    ViewGameComponent.prototype.checkEnd = function () {
        var board = this.game.board;
        // kolone
        if (board[0 * 3 + 0] != '_' && board[0 * 3 + 0] == board[0 * 3 + 1] && board[0 * 3 + 0] == board[0 * 3 + 2]) {
            return [0, 0, 2, 0];
        }
        if (board[1 * 3 + 0] != '_' && board[1 * 3 + 0] == board[1 * 3 + 1] && board[1 * 3 + 0] == board[1 * 3 + 2]) {
            return [0, 1, 2, 1];
        }
        if (board[2 * 3 + 0] != '_' && board[2 * 3 + 0] == board[2 * 3 + 1] && board[2 * 3 + 0] == board[2 * 3 + 2]) {
            return [0, 2, 2, 2];
        }
        // redovi
        if (board[0 + 0 * 3] != '_' && board[0 + 0 * 3] == board[0 + 1 * 3] && board[0 + 0 * 3] == board[0 + 2 * 3]) {
            return [0, 0, 0, 2];
        }
        if (board[1 + 0 * 3] != '_' && board[1 + 0 * 3] == board[1 + 1 * 3] && board[1 + 0 * 3] == board[1 + 2 * 3]) {
            return [1, 0, 1, 2];
        }
        if (board[2 + 0 * 3] != '_' && board[2 + 0 * 3] == board[2 + 1 * 3] && board[2 + 0 * 3] == board[2 + 2 * 3]) {
            return [2, 0, 2, 2];
        }
        // dijagonale
        if (board[0 * 3 + 0] != '_' && board[0 * 3 + 0] == board[1 * 3 + 1] && board[0 * 3 + 0] == board[2 * 3 + 2]) {
            return [0, 0, 2, 2];
        }
        if (board[0 * 3 + 2] != '_' && board[0 * 3 + 2] == board[1 * 3 + 1] && board[0 * 3 + 2] == board[2 * 3 + 0]) {
            return [2, 0, 0, 2];
        }
        return null;
    };
    ViewGameComponent = __decorate([
        core_1.Component({
            selector: 'my-view-game',
            templateUrl: 'html/view_game.component.html',
            directives: [common_1.FORM_DIRECTIVES, router_deprecated_1.ROUTER_DIRECTIVES],
            viewBindings: [common_1.FORM_BINDINGS]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http, router_deprecated_1.Router, router_deprecated_1.RouteParams])
    ], ViewGameComponent);
    return ViewGameComponent;
}());
exports.ViewGameComponent = ViewGameComponent;
//# sourceMappingURL=view_game.component.js.map