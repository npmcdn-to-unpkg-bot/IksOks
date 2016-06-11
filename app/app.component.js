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
var home_component_1 = require('./home.component');
var register_component_1 = require("./register.component");
var login_component_1 = require("./login.component");
var play_component_1 = require("./play_component");
var view_game_component_1 = require("./view_game.component");
var view_player_component_1 = require("./view_player.component");
var view_players_component_1 = require("./view_players.component");
var view_games_component_1 = require("./view_games.component");
var new_game_component_1 = require("./new_game_component");
var active_games_component_1 = require("./active_games.component");
var AppComponent = (function () {
    function AppComponent(router, http) {
        var _this = this;
        this.router = router;
        this.http = http;
        this.onPage = true;
        router.subscribe(function (val) {
            _this.token = localStorage.getItem('token');
            _this.username = localStorage.getItem('username');
            _this.isAuth = _this.token != null;
        });
        this.activeGames = -1;
        this.loggingOut = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.checkActiveGames();
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.onPage = false;
    };
    AppComponent.prototype.checkActiveGames = function (ovo) {
        if (ovo === void 0) { ovo = this; }
        if (!ovo.onPage) {
            return;
        }
        console.log("CHECKING GAMES");
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_active_games_service.php', "what=count", { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            if (!ovo.onPage) {
                return;
            }
            console.log(err._body);
            setTimeout(function () { ovo.checkActiveGames(ovo); }, 5000);
        }, function () {
            if (!ovo.onPage) {
                return;
            }
            console.log("CHECKED GAMES");
            console.log(data._body);
            var cnt = JSON.parse(data._body);
            if (ovo.activeGames != -1 && cnt > ovo.activeGames) {
                ovo.getLastGame();
            }
            ovo.activeGames = cnt;
            setTimeout(function () { ovo.checkActiveGames(ovo); }, 2000);
        });
    };
    AppComponent.prototype.getLastGame = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_active_games_service.php', "what=last", { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            console.log(err._body);
        }, function () {
            console.log(data._body);
            var game = JSON.parse(data._body);
            _this.newestGameId = game.id;
            document.getElementById("active-games").style.color = "#B21212";
            document.getElementById("notification").innerHTML = "Nova igra protiv: " + (_this.token == game.player1.id ? game.player2.username : game.player1.username);
            document.getElementById("notification").style.display = "block";
        });
    };
    AppComponent.prototype.notificationClick = function () {
        this.clearNotifications();
        this.router.navigate(['/Play', { id: this.newestGameId }]);
    };
    AppComponent.prototype.clearNotifications = function () {
        document.getElementById("notification").style.display = "none";
        document.getElementById("active-games").style.color = "#333";
    };
    AppComponent.prototype.onLogout = function () {
        var _this = this;
        if (this.loggingOut) {
            return;
        }
        this.loggingOut = true;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/logout_service.php', "", { headers: headers })
            .subscribe(function (d) { return data = d; }, function (err) {
            console.log(err);
            var obj = JSON.parse(err._body);
            document.getElementById("alert").innerHTML = obj;
            _this.loggingOut = false;
        }, function () {
            console.log(data);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            _this.token = null;
            _this.username = null;
            _this.isAuth = false;
            _this.router.renavigate();
            _this.loggingOut = false;
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'html/app.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [router_deprecated_1.ROUTER_PROVIDERS]
        }),
        router_deprecated_1.RouteConfig([
            {
                path: '/',
                name: 'Home',
                component: home_component_1.HomeComponent,
                useAsDefault: true
            },
            {
                path: '/register',
                name: 'Register',
                component: register_component_1.RegisterComponent
            },
            {
                path: '/login',
                name: 'Login',
                component: login_component_1.LoginComponent
            },
            {
                path: '/play/:id',
                name: 'Play',
                component: play_component_1.PlayComponent
            },
            {
                path: '/games/:id',
                name: 'ViewGame',
                component: view_game_component_1.ViewGameComponent
            },
            {
                path: '/players/:id',
                name: 'ViewPlayer',
                component: view_player_component_1.ViewPlayerComponent
            },
            {
                path: '/games',
                name: 'ViewGames',
                component: view_games_component_1.ViewGamesComponent
            },
            {
                path: '/players',
                name: 'ViewPlayers',
                component: view_players_component_1.ViewPlayersComponent
            },
            {
                path: '/new_game',
                name: 'NewGame',
                component: new_game_component_1.NewGameComponent
            },
            {
                path: '/active_games',
                name: 'ActiveGames',
                component: active_games_component_1.ActiveGamesComponent
            }
        ]), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map