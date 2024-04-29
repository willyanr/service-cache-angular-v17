
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';




interface CacheContent {
    expiry: number;
    cached: any;
  }

  
@Injectable({
    providedIn: 'root'
  })
  export class CacheService {
    private cache = new Map<string, CacheContent>(); 


    getCache(key: string): Observable<any> | undefined {
      const data = this.cache.get(key);
      if (!data) {
        return undefined;
      }
    
      const now = new Date().getTime();
      if (now > data.expiry) {
        this.cache.delete(key);
        return undefined;
      }
    
      return of(data.cached);
    }
    
      

    setCache(key: string, cached: any, timer: number = 600000): Observable<any> {
      if (this.cache.has(key)){
          throw new Error(`Chave já existe'${key}`);
      }
  
      const expiry = new Date().getTime() + timer;
      this.cache.set(key, { expiry, cached });


      return of(cached);
  }
  
    

    cacheObservable(key: string, fallback: Observable<any>, timer?: number): Observable<any> {
      const cached = this.getCache(key);
      console.log('foi usado a chave', key, 'e o retorno foi', cached)
      if (cached) {
        return cached;
      } else {
        return fallback.pipe(
          tap(cached => {
            this.setCache(key, cached, timer);
          })
        );
      }
    }
    }