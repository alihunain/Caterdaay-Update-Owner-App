import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as globalVariable from "./global";
import 'rxjs/add/operator/map';

@Injectable()
export class ThreeService {
    constructor(private http: Http) { }
    getOrders(id) {
        return this.http.get(globalVariable.url3 + 'restaurantorders/' + id).map((response: Response) => response.json());
    }
    getCustomersOrdersList(id) {
        return this.http.get(globalVariable.url3 + 'customerorder/' + id).map((response: Response) => response.json());
    }
    updateCustomersOrdersStatus(data) {
        return this.http.put(globalVariable.url3 + 'order/' + data.id, data).map((response: Response) => response.json());
    }
    getOneOrder(id) {
        return this.http.get(globalVariable.url3 + 'order/' + id).map((response: Response) => response.json());
    }
    OrderEmail(obj){
        return this.http.post(globalVariable.url1 + 'order-email-accepted',obj).map((response:Response)=> response.json());
    }
    GetCustomer(id){
        return this.http.get(globalVariable.url4 + "customers/" +  id).map((response:Response)=>response.json());
    }
    checkRestroRating(data) {
        return this.http.post(globalVariable.url3+'rating/checkrating', data)
        .map(
        (response: Response) => response.json()
        );
    } 

}