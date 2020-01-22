import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as globalVariable from "./global";
import 'rxjs/add/operator/map';

@Injectable()
export class FourService {
    constructor(private http: Http) { }
    getCustomers(id) {
        return this.http.get(globalVariable.url4 + 'customers/' + id).map((response: Response) => response.json());
    }
    getCustomersOrders(data) {
        return this.http.post(globalVariable.url4 + 'customers/multiple', data).map((response: Response) => response.json());
    }
    
}