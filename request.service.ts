import { CacheService } from './cache.service';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from "@angular/core";
import { exempleInterface } from '';
import { environment } from '../environments/environment'; 
import { Observable, shareReplay } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class FinancialService {
  
    private url = environment.apiUrl
    cacheService = inject(CacheService);
    httpService = inject(HttpClient)
    constructor() { }

    getData(): Observable<any> {
      const key = 'exemplekey'; 
      return this.cacheService.cacheObservable(key, this.httpService.get<exempleInterface[]>(this.url + 'api').pipe(shareReplay()));
    }
  

}