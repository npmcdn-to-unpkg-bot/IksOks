import { Component, OnInit } from '@angular/core';
import { FormBuilder, FORM_DIRECTIVES, FORM_BINDINGS } from '@angular/common'
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-new-game',
    templateUrl: 'html/new_game.component.html',
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    viewBindings: [FORM_BINDINGS]
})
export class NewGameComponent implements OnInit {
    players: Object[];
    challenging: boolean;

    constructor(builder: FormBuilder, private http: Http, private router: Router,
                private routeParams: RouteParams) {
        if(localStorage.getItem('token') == null){
            this.router.parent.navigate(['./Home']);
        }
        this.challenging = false;
    }

    ngOnInit() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_players_service.php', "", { headers: headers })
            .subscribe(
                d => {
                    data = d;
                },
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.display = "none";
                },
                () => {
                    //console.log(data._body);
                    this.players = JSON.parse(data._body);
                    document.getElementById("spinner").style.display = "none";
                }
            );
    }

    challenge(id) {
        if(this.challenging) {
            return;
        }
        this.challenging = true;
        document.getElementById("spinner").style.display = "block";

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var postdata = "player2_id=" + id + "&sign=" + (document.getElementById("rdb-x").checked ? "x" : "o");
        var data;
        this.http.post('../IksOks/php/services/new_game_service.php', postdata, { headers: headers })
            .subscribe(
                d => {
                    data = d;
                },
                err => {
                    console.log(err);
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
                    document.getElementById("playerinfo").style.display = "block";
                    this.challenging = false;
                }
            );
    }
}