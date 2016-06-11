import { Component, OnInit } from '@angular/core';
import { FormBuilder, FORM_DIRECTIVES, FORM_BINDINGS } from '@angular/common'
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-home',
    templateUrl: 'html/home.component.html',
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    viewBindings: [FORM_BINDINGS]
})
export class HomeComponent {
    token: String;
    username: String;
    isAuth: boolean;
    players: Object[];
    games: Object[];

    constructor(builder: FormBuilder, private http: Http, private router: Router,
                private routeParams: RouteParams) {
        router.parent.subscribe((val) => {
            this.token = localStorage.getItem('token');
            this.username = localStorage.getItem('username');
            this.isAuth = this.token != null;
        });
    }

    ngOnInit() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        var data1;
        this.http.post('../IksOks/php/services/get_players_service.php', "limit=5&sort_by=wins", { headers: headers })
            .subscribe(
                d => data1 = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("spinner-players").style.display = "none";
                    document.getElementById("alert-players").innerHTML = obj;
                },
                () => {
                    //console.log(data1._body);
                    this.players = JSON.parse(data1._body);
                    document.getElementById("spinner-players").style.display = "none";
                }
            );

        var data2;
        this.http.post('../IksOks/php/services/get_games_service.php', "limit=5", { headers: headers })
            .subscribe(
                d => data2 = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("spinner-games").style.display = "none";
                    document.getElementById("alert-games").innerHTML = obj;
                },
                () => {
                    //console.log(data2._body);
                    this.games = JSON.parse(data2._body);
                    document.getElementById("spinner-games").style.display = "none";
                }
            );
    }
}