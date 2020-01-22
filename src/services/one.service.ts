import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as globalVariable from "./global";
import 'rxjs/add/operator/map';

@Injectable()
export class OneService {
    constructor(private http: Http) { }
    getLocalOwner(){
        
    }
    signup(data){
        return this.http.post(globalVariable.url1 + 'owner' , data)
            .map(
            (response: Response) => response.json()
            );
    }
    login(data) {
        return this.http.post(globalVariable.url1 + 'login', data)
            .map((response: Response) => {
                let owner = response.json();
                return owner;
            });
    }
    getOwner(id){
        return this.http.get(globalVariable.url1 + "owners/" + id) .map((response: Response) => {
            let ower = response.json();
            return ower;
        });
    }
    forgetPasswordOwner(data){
        return this.http.post(globalVariable.url1 + 'owner/forget-password', data)
            .map((response: Response) => {
                let ower = response.json();
                return ower;
            });
    }
    editOwner(data){
        return this.http.put(globalVariable.url1 + 'owners/' + data._id, data)
            .map((response: Response) => response.json());
    }
    editDriver(data) {
        return this.http.put(globalVariable.url1 + 'driver/' + data._id, data)
            .map((response: Response) => response.json());
    }
    Notification(data){
        return this.http.post(globalVariable.url1 + 'notifications',data).map((response:Response)=>response.json())
    }
    updateCustomer(data) {
		return this.http.put(globalVariable.url4+'customers/' +data._id ,data)
		.map(
			(response: Response) => response.json()
		);
	}
    // AddTokenOwner(data){
    //     return this.http.put(globalVariable.url1 + 'owner/' + data._id, data)
    //         .map((response: Response) => response.json());
    // }
    passwordEditOwner(data){
        return this.http.put(globalVariable.url1 + 'change-password/' + data._id, data)
            .map(
            (response: Response) => response.json()
            );
    }

    getAllDrivers() {
        return this.http.get(globalVariable.url1+'driver/')
        .map((response: Response) => response.json());
    }
    getAllResturant(){
        return this.http.get(globalVariable.url1+'kitchen/' ).map((response:Response)=>response.json());
    }
    getDriver(id) {
        return this.http.get(globalVariable.url1 + 'driver/' + id)
            .map((response: Response) => response.json());
    }
}