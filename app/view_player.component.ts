import { Component, OnInit } from '@angular/core';
import { FormBuilder, FORM_DIRECTIVES, FORM_BINDINGS } from '@angular/common'
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-view-player',
    templateUrl: 'html/view_player.component.html',
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    viewBindings: [FORM_BINDINGS]
})
export class ViewPlayerComponent implements OnInit {
    playerId: Number;
    player: Object;
    games: Object[];
    challenging: boolean;
    isAuth: boolean;

    constructor(builder: FormBuilder, private http: Http, private router: Router,
                private routeParams: RouteParams) {
        this.playerId = parseInt(this.routeParams.get('id'));
        this.player = "";
        this.challenging = false;
        this.isAuth = localStorage.getItem('token') != null;
    }

    ngOnInit() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        var data1;
        this.http.post('../IksOks/php/services/get_player_service.php', "id=" + this.playerId, { headers: headers })
            .subscribe(
                d => data1 = d,
                err => {
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert-player").innerHTML = obj;
                    document.getElementById("spinner-player").style.display = "none";
                },
                () => {
                    //console.log(data1._body);
                    this.player = JSON.parse(data1._body);
                    document.getElementById("spinner-player").style.display = "none";
                    document.getElementById("playerinfo").style.display = "block";
                }
            );

        var data2;
        this.http.post('../IksOks/php/services/get_games_service.php', "player_id=" + this.playerId, { headers: headers })
            .subscribe(
                d => data2 = d,
                err => {
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert-games").innerHTML = obj;
                    document.getElementById("spinner-game").style.display = "none";
                },
                () => {
                    //console.log(data2._body);
                    this.games = JSON.parse(data2._body);
                    document.getElementById("spinner-games").style.display = "none";
                    document.getElementById("playerinfo").style.display = "block";
                }
            );
    }

    challenge(sign) {
        if(this.challenging) {
            return;
        }
        this.challenging = true;
        document.getElementById("spinner").style.display = "block";

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var postdata = "player2_id=" + this.playerId + "&sign=" + sign;
        var data;
        this.http.post('../IksOks/php/services/new_game_service.php', postdata, { headers: headers })
            .subscribe(
                d => {
                    data = d;
                    console.log(data);
                },
                err => {
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.display = "none";
                    this.challenging = false;
                },
                () => {
                    //console.log(data._body);
                    var game = JSON.parse(data._body);
                    this.router.root.navigate(['./Play', {id: game.id}]);
                    document.getElementById("spinner").style.display = "none";
                    this.challenging = false;
                }
            );
    }
}