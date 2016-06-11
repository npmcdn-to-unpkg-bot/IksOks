import { Component, OnInit } from '@angular/core';
import { FormBuilder, FORM_DIRECTIVES, FORM_BINDINGS } from '@angular/common'
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-active-games',
    templateUrl: 'html/active_games.component.html',
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    viewBindings: [FORM_BINDINGS]
})
export class ActiveGamesComponent implements OnInit {
    games: Object[];
    userId: number;

    constructor(builder: FormBuilder, private http: Http, private router: Router,
                private routeParams: RouteParams) {
        this.userId = localStorage.getItem('token');
    }

    ngOnInit() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_active_games_service.php', "", { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.display = "none";
                },
                () => {
                    //console.log(data._body);
                    this.games = JSON.parse(data._body);
                    document.getElementById("spinner").style.display = "none";
                }
            );
    }
}