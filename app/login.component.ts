import { Component } from '@angular/core';
import { FormBuilder, ControlGroup } from '@angular/common'
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-login',
    templateUrl: 'html/login.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class LoginComponent {
    loginForm: ControlGroup;

    constructor(builder: FormBuilder, private http: Http, private router: Router) {
        this.loginForm = builder.group({
            username: [""],
            password: [""]
        });
        if(localStorage.getItem('token') != null){
            this.router.parent.navigate(['./Home']);
        }
    }

    onLogin(): void {
        document.getElementById("alert").innerHTML = "";
        document.getElementById("spinner").style.visibility = "visible";
        var postdata = "username=" + this.loginForm.value.username + "&password=" + this.loginForm.value.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/login_service.php', postdata, { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.visibility = "hidden";
                },
                () => {
                    var obj = JSON.parse(data._body);
                    localStorage.setItem('token', obj.token);
                    localStorage.setItem('username', obj.username);
                    this.router.parent.navigate(['./Home']);
                    document.getElementById("spinner").style.visibility = "hidden";
                }
            );
    }
}