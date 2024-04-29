# service-cache-angular-v17


`cache.service.ts`

Neste arquivo, é definido o serviço de cache que permite armazenar e recuperar dados utilizando chaves em formato de string.


Criamos também uma interface dentro do `cache.service.ts` para os dados do cache: 

```typescript
interface CacheContent {
expiry: number;
cached: any;
}
```


Definimos a variavel `cache` para mapear dados utilizando chaves(keys) em formatos string:
```typescript
export class CacheService {
    private cache = new Map<string, CacheContent>();
```


Criamos a função `getCache` para obter os dados salvos em cache, utilizamos o operador (of) do rxjs, para retornar um Observable de único valor e de forma direta:
```typescript
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

```

Na função `setCache` temos como objetivo registrar os dados em cache, caso eles não existam, verificando através da chave fornecida. Definimos a key, um timer de expiração e em seguida retornamos os dados:
```typescript
    setCache(key: string, cached: any, timer: number = 600000): Observable<any> {
      if (this.cache.has(key)){
          throw new Error(`Chave já existe'${key}`);
      }
  
      const expiry = new Date().getTime() + timer;
      this.cache.set(key, { expiry, cached });


      return of(cached);
  }
```


Aqui está o segredo meus amigos(as), antes de explicar, vejamos mais abaixo o arquivo `request.service.ts:`:
```typescript
    cacheObservable(key: string, fallback: Observable<any>, timer?: number): Observable<any> {
      const cached = this.getCache(key);

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
```



Arquivo `request.service.ts:`
```typescript  
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
```


Definimos uma key através da variavel e ao invés de retornamos diretamente a solicitação http chamamos a função `cacheObservable`
onde passamos como parametros a key, o método http com a url da api.

Ou seja, todos os componentes que realizam essas solicitações vão passar pela função que ira verificar se os dados já existem em cache e se sim, retornamos os dados em cache. Caso não exista por nao existir mesmo ou por já ter expirado utilizamos o fallback para ai sim realizar a solicitação http e atualizar o cache com os dados.
