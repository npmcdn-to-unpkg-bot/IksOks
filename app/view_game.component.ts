import { Component, OnInit } from '@angular/core';
import { FormBuilder, FORM_DIRECTIVES, FORM_BINDINGS } from '@angular/common'
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-view-game',
    templateUrl: 'html/view_game.component.html',
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    viewBindings: [FORM_BINDINGS]
})
export class ViewGameComponent implements OnInit {
    gameId: Number;
    game: Object;
    winner: string;

    constructor(builder: FormBuilder, private http: Http, private router: Router,
                private routeParams: RouteParams) {
        this.gameId = parseInt(this.routeParams.get('id'));
    }

    ngOnInit() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_game_service.php', "id=" + this.gameId, { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    var obj = JSON.parse(err._body);
                    document.getElementById("spinner").style.display = "none";
                    document.getElementById("alert").innerHTML = obj;
                },
                () => {
                    //console.log(data._body);
                    this.game = JSON.parse(data._body);
                    this.refreshBoard();
                    document.getElementById("spinner").style.display = "none";
                    document.getElementById("gamepanel").style.display = "block";
                }
            );
    }

    refreshBoard() {
        for(var i = 0; i < 9; ++i) {
            var src = "";
            if(this.game.board.charAt(i) == 'x') {
                src = "res/play_x.svg";
            }
            else if(this.game.board.charAt(i) == 'o') {
                src = "res/play_o.svg";
            }
            document.getElementById("grid" + i).src = src;
        }
        var end = this.checkEnd();
        if(end) {
            this.winner = this.game.board.charAt(end[0] + end[1]*3);
            var line = document.getElementById("victory-line");
            line.style.stroke = this.winner == 'x' ? "#0971B2" : "#B21212";
            line.setAttribute('x1', 10 + end[0] * 20);
            line.setAttribute('y1', 10 + end[1] * 20);
            line.setAttribute('x2', 10 + end[2] * 20);
            line.setAttribute('y2', 10 + end[3] * 20);
            document.getElementById("victory-img").style.display = "block";
        }
    }

    checkEnd() : number[] {
        var board = this.game.board;
        // kolone
        if(board[0 * 3 + 0] != '_' && board[0 * 3 + 0] == board[0 * 3 + 1] && board[0 * 3 + 0] == board[0 * 3 + 2]) {
            return [ 0, 0, 2, 0 ];
        }
        if(board[1 * 3 + 0] != '_' && board[1 * 3 + 0] == board[1 * 3 + 1] && board[1 * 3 + 0] == board[1 * 3 + 2]) {
            return [ 0, 1, 2, 1 ];
        }
        if(board[2 * 3 + 0] != '_' && board[2 * 3 + 0] == board[2 * 3 + 1] && board[2 * 3 + 0] == board[2 * 3 + 2]) {
            return [ 0, 2, 2, 2 ];
        }
        // redovi
        if(board[0 + 0 * 3] != '_' && board[0 + 0 * 3] == board[0 + 1 * 3] && board[0 + 0 * 3] == board[0 + 2 * 3]) {
            return [ 0, 0, 0, 2 ];
        }
        if(board[1 + 0 * 3] != '_' && board[1 + 0 * 3] == board[1 + 1 * 3] && board[1 + 0 * 3] == board[1 + 2 * 3]) {
            return [ 1, 0, 1, 2 ];
        }
        if(board[2 + 0 * 3] != '_' && board[2 + 0 * 3] == board[2 + 1 * 3] && board[2 + 0 * 3] == board[2 + 2 * 3]) {
            return [ 2, 0, 2, 2 ];
        }
        // dijagonale
        if(board[0 * 3 + 0] != '_' && board[0 * 3 + 0] == board[1 * 3 + 1] && board[0 * 3 + 0] == board[2 * 3 + 2]) {
            return [ 0, 0, 2, 2 ];
        }
        if(board[0 * 3 + 2] != '_' && board[0 * 3 + 2] == board[1 * 3 + 1] && board[0 * 3 + 2] == board[2 * 3 + 0]) {
            return [ 2, 0, 0, 2 ];
        }
        return null;
    }
}