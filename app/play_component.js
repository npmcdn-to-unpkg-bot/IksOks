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
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
require('rxjs/Rx');
var PlayComponent = (function () {
    function PlayComponent(http, router, routeParams) {
        this.http = http;
        this.router = router;
        this.routeParams = routeParams;
        if (localStorage.getItem('token') == null) {
            this.router.parent.navigate(['./Home']);
        }
        this.userId = localStorage.getItem('token');
        this.onTurn = false;
        this.onPage = true;
    }
    PlayComponent.prototype.ngOnInit = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_game_service.php', "id=" + this.routeParams.get('id'), { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            var obj = JSON.parse(err._body);
            document.getElementById("spinner").style.display = "none";
            document.getElementById("alert").innerHTML = obj;
        }, function () {
            //console.log(data._body);
            _this.game = JSON.parse(data._body);
            _this.refreshBoard();
            document.getElementById("alert").innerHTML = "";
            document.getElementById("spinner").style.display = "none";
            var countX = _this.game.board.split("x").length - 1;
            var countO = _this.game.board.split("o").length - 1;
            if (_this.game.player1.id == _this.userId) {
                _this.playerSign = 'x';
                if (countX <= countO) {
                    _this.onTurn = true;
                }
                else {
                    _this.checkBoard();
                }
            }
            else if (_this.game.player2.id == _this.userId) {
                _this.playerSign = 'o';
                if (countX > countO) {
                    _this.onTurn = true;
                }
                else {
                    _this.checkBoard();
                }
            }
            else {
                document.getElementById("alert").innerHTML = "Vi niste igrač.";
            }
        });
    };
    PlayComponent.prototype.ngOnDestroy = function () {
        this.onPage = false;
    };
    PlayComponent.prototype.refreshBoard = function () {
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
    PlayComponent.prototype.checkEnd = function () {
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
    PlayComponent.prototype.gridClick = function (index) {
        var _this = this;
        if (!this.onTurn) {
            return;
        }
        if (this.game.board.charAt(index) != '_') {
            return;
        }
        this.onTurn = false;
        //console.log("PLAY click " + index);
        document.getElementById("alert").innerHTML = "Igram...";
        document.getElementById("spinner").style.display = "block";
        var postdata = "id=" + this.game.id + "&index=" + index + "&sign=x";
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/play_service.php', postdata, { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("alert").innerHTML = obj;
            document.getElementById("spinner").style.display = "none";
            _this.refreshBoard();
            _this.onTurn = true;
        }, function () {
            //console.log("PLAY response");
            //console.log(data._body);
            var obj = JSON.parse(data._body);
            _this.game.board = obj.board;
            _this.refreshBoard();
            if (!obj.end) {
                _this.checkBoard();
            }
            else {
                document.getElementById("alert").innerHTML = "Igra je gotova!";
                document.getElementById("spinner").style.display = "none";
            }
        });
        document.getElementById("grid" + index).src = "res/play_" + this.playerSign + ".svg";
    };
    PlayComponent.prototype.checkBoard = function (ovo) {
        var _this = this;
        if (ovo === void 0) { ovo = this; }
        if (!this.onPage) {
            return;
        }
        //console.log("PLAY checking");
        document.getElementById("alert").innerHTML = "Čeka se protivnik...";
        document.getElementById("spinner").style.display = "block";
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        ovo.http.post('../IksOks/php/services/get_board_service.php', "id=" + ovo.game.id, { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            if (!_this.onPage) {
                return;
            }
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("alert").innerHTML = obj;
            document.getElementById("spinner").style.display = "none";
        }, function () {
            if (!_this.onPage) {
                return;
            }
            //console.log("PLAY checked");
            //console.log(data._body);
            var obj = JSON.parse(data._body);
            if (!obj.end && ovo.game.board == obj.board) {
                setTimeout(function () { ovo.checkBoard(ovo); }, 500);
                return;
            }
            ovo.game.board = obj.board;
            ovo.refreshBoard();
            document.getElementById("alert").innerHTML = "";
            document.getElementById("spinner").style.display = "none";
            ovo.onTurn = true;
        });
    };
    PlayComponent = __decorate([
        core_1.Component({
            selector: 'my-play',
            templateUrl: 'html/play.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [http_1.Http, router_deprecated_1.Router, router_deprecated_1.RouteParams])
    ], PlayComponent);
    return PlayComponent;
}());
exports.PlayComponent = PlayComponent;
//# sourceMappingURL=play_component.js.map