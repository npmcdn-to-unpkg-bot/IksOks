import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {Http, Headers} from '@angular/http';

import {HomeComponent} from './home.component';
import {RegisterComponent} from "./register.component";
import {LoginComponent} from "./login.component";
import {PlayComponent} from "./play_component";
import {ViewGameComponent} from "./view_game.component";
import {ViewPlayerComponent} from "./view_player.component";
import {ViewPlayersComponent} from "./view_players.component";
import {ViewGamesComponent} from "./view_games.component";
import {NewGameComponent} from "./new_game_component";
import {ActiveGamesComponent} from "./active_games.component";

@Component({
    selector: 'my-app',
    templateUrl: 'html/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
@RouteConfig([
    {
        path: '/',
        name: 'Home',
        component: HomeComponent,
        useAsDefault: true
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    },
    {
        path: '/play/:id',
        name: 'Play',
        component: PlayComponent
    },
    {
        path: '/games/:id',
        name: 'ViewGame',
        component: ViewGameComponent
    },
    {
        path: '/players/:id',
        name: 'ViewPlayer',
        component: ViewPlayerComponent
    },
    {
        path: '/games',
        name: 'ViewGames',
        component: ViewGamesComponent
    },
    {
        path: '/players',
        name: 'ViewPlayers',
        component: ViewPlayersComponent
    },
    {
        path: '/new_game',
        name: 'NewGame',
        component: NewGameComponent
    },
    {
        path: '/active_games',
        name: 'ActiveGames',
        component: ActiveGamesComponent
    }
])
export class AppComponent {
    token: number;
    username: String;
    isAuth: boolean;
    loggingOut: boolean;
    activeGames: number;
    newestGameId: number;
    onPage: boolean;

    constructor(private router: Router, private http: Http) {
        this.onPage = true;
        router.subscribe((val) => {
            this.token = localStorage.getItem('token');
            this.username = localStorage.getItem('username');
            this.isAuth = this.token != null;
        });
        this.activeGames = -1;
        this.loggingOut = false;
    }

    ngOnInit() {
        this.checkActiveGames();
    }

    ngOnDestroy() {
        this.onPage = false;
    }

    checkActiveGames(ovo = this) {
        if(!ovo.onPage) {
            return;
        }
        //console.log("CHECKING GAMES");

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_active_games_service.php', "what=count", { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err._body);
                    if(!ovo.onPage) {
                        return;
                    }
                    setTimeout(function() { ovo.checkActiveGames(ovo); }, 5000);
                },
                () => {
                    if(!ovo.onPage) {
                        return;
                    }
                    //console.log("CHECKED GAMES");
                    //console.log(data._body);
                    var cnt = JSON.parse(data._body);
                    if(ovo.activeGames != -1 && cnt > ovo.activeGames) {
                        ovo.getLastGame();
                    }
                    ovo.activeGames = cnt;
                    setTimeout(function() { ovo.checkActiveGames(ovo); }, 2000);
                }
            );
    }

    getLastGame() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_active_games_service.php', "what=last", { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err._body);
                },
                () => {
                    //console.log(data._body);
                    var game = JSON.parse(data._body);
                    this.newestGameId = game.id;
                    document.getElementById("active-games").style.color = "#B21212";
                    document.getElementById("notification").innerHTML = "Nova igra protiv: " + (this.token == game.player1.id ? game.player2.username : game.player1.username);
                    document.getElementById("notification").style.display = "block";
                }
            );
    }

    notificationClick() {
        this.clearNotifications();
        this.router.navigate(['/Play', {id: this.newestGameId}]);
    }

    clearNotifications() {
        document.getElementById("notification").style.display = "none";
        document.getElementById("active-games").style.color = "#333";
    }

    onLogout(): void {
        if(this.loggingOut) {
            return;
        }
        this.loggingOut = true;
        
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/logout_service.php', "", { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    this.loggingOut = false;
                },
                () => {
                    //console.log(data);
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    this.token = null;
                    this.username = null;
                    this.isAuth = false;
                    this.router.renavigate();
                    this.loggingOut = false;
                }
            );
    }
}