import { Component } from '@angular/core';
import { FormBuilder, ControlGroup } from '@angular/common'
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Component({
    selector: 'my-register',
    templateUrl: 'html/register.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class RegisterComponent {
    registerForm: ControlGroup;

    constructor(builder: FormBuilder, private http: Http, private router: Router) {
        this.registerForm = builder.group({
            username: [""],
            email: [""],
            password: [""],
            password_confirm: [""]
        });

        if(localStorage.getItem('token') != null){
            this.router.parent.navigate(['./Home']);
        }
    }

    onRegister(): void {
        document.getElementById("alert").innerHTML = "";
        if(this.registerForm.value.password != this.registerForm.value.password_confirm) {
            document.getElementById("alert").innerHTML = "Šifre se ne slažu.";
            return;
        }
        document.getElementById("spinner").style.visibility = "visible";
        var postdata = "username=" + this.registerForm.value.username + "&email=" + this.registerForm.value.email + "&password=" + this.registerForm.value.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data;
        this.http.post('../IksOks/php/services/register_service.php', postdata, { headers: headers })
            .subscribe(
                d => data = d,
                err => {
                    console.log(err);
                    var obj = JSON.parse(err._body);
                    document.getElementById("alert").innerHTML = obj;
                    document.getElementById("spinner").style.visibility = "hidden";
                },
                () => {
                    //console.log(data);
                    var obj = JSON.parse(data._body);
                    localStorage.setItem('token', obj.token);
                    localStorage.setItem('username', obj.username);
                    this.router.parent.navigate(['./Home']);
                    document.getElementById("spinner").style.visibility = "hidden";
                }
            );
    }
}