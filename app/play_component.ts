import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ControlGroup } from '@angular/common'
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-play',
    templateUrl: 'html/play.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class PlayComponent {
    onPage: boolean;
    game: Object;
    onTurn: boolean;
    userId: number;
    playerSign: string;
    winner: string;

    constructor(private http: Http, private router: Router,
                private routeParams: RouteParams) {
        if(localStorage.getItem('token') == null){
            this.router.parent.navigate(['./Home']);
        }
        this.userId = localStorage.getItem('token');
        this.onTurn = false;
        this.onPage = true;
    }

    ngOnInit() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/get_game_service.php', "id=" + this.routeParams.get('id'), { headers: headers })
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
                    document.getElementById("alert").innerHTML = "";
                    document.getElementById("spinner").style.display = "none";
                    var countX = this.game.board.split("x").length - 1;
                    var countO = this.game.board.split("o").length - 1;
                    if(this.game.player1.id == this.userId) {
                        this.playerSign = 'x';
                        if(countX <= countO) {
                            this.onTurn = true;
                        }
                        else {
                            this.checkBoard();
                        }
                    }
                    else if(this.game.player2.id == this.userId) {
                        this.playerSign = 'o';
                        if(countX > countO) {
                            this.onTurn = true;
                        }
                        else {
                            this.checkBoard();
                        }
                    }
                    else {
                        document.getElementById("alert").innerHTML = "Vi niste igrač.";
                    }
                }
            );
    }

    ngOnDestroy() {
        this.onPage = false;
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

    gridClick(index) {
        if(!this.onTurn) {
            return;
        }
        if(this.game.board.charAt(index) != '_') {
            return;
        }
        this.onTurn = false;

        //console.log("PLAY click " + index);
        document.getElementById("alert").innerHTML = "Igram...";
        document.getElementById("spinner").style.display = "block";

        var postdata = "id=" + this.game.id + "&index=" + index + "&sign=x";
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/play_service.php', postdata, { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.display = "none";
                    this.refreshBoard();
                    this.onTurn = true;
                },
                () => {
                    //console.log("PLAY response");
                    //console.log(data._body);
                    var obj = JSON.parse(data._body);
                    this.game.board = obj.board;
                    this.refreshBoard();
                    if(!obj.end) {
                        this.checkBoard();
                    }
                    else {
                        document.getElementById("alert").innerHTML = "Igra je gotova!";
                        document.getElementById("spinner").style.display = "none";
                    }
                }
            );
        document.getElementById("grid" + index).src = "res/play_" + this.playerSign + ".svg";
    }

    checkBoard(ovo = this) {
        if(!this.onPage) {
            return;
        }
        //console.log("PLAY checking");
        document.getElementById("alert").innerHTML = "Čeka se protivnik...";
        document.getElementById("spinner").style.display = "block";

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        ovo.http.post('../IksOks/php/services/get_board_service.php', "id=" + ovo.game.id, { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    if(!this.onPage) {
                        return;
                    }
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.display = "none";
                },
                () => {
                    if(!this.onPage) {
                        return;
                    }
                    //console.log("PLAY checked");
                    //console.log(data._body);
                    var obj = JSON.parse(data._body);
                    if(!obj.end && ovo.game.board == obj.board) {
                        setTimeout(function() { ovo.checkBoard(ovo); }, 500);
                        return;
                    }
                    ovo.game.board = obj.board;
                    ovo.refreshBoard();
                    document.getElementById("alert").innerHTML = "";
                    document.getElementById("spinner").style.display = "none";
                    ovo.onTurn = true;
                }
            );
    }
}