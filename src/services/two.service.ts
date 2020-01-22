import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as globalVariable from "./global";
import 'rxjs/add/operator/map';

@Injectable()
export class TwoService {
    constructor(private http: Http) { }
    getComplexity() {
        return this.http.get(globalVariable.url2 + 'users/complexity')
            .map((response: Response) => response.json());
    }

}