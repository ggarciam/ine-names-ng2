import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable}     from 'rxjs/Observable';
import {Subject}        from 'rxjs';

@Injectable()
export class NamesService {
  private names: Subject<Name[]>; // array of all names extracted from Wikipedia
  private values: Subject<Value[]>; // array of all values for a name extracted from INE
  private dataStore: {
    names: Name[],
    values: Value[]
  };

  constructor(
    private http: Http
  ) {
    this.dataStore = {names: [], values: []};
    this.names = <Subject<Name[]>>new Subject();
    this.values = <Subject<Value[]>>new Subject();
  }
  getLocalNames(): Name[] {
    return this.dataStore.names;
  }

  getNames(): Observable<Name[]> {
    return this.names.asObservable();
  }

  setNames(): void {
    let urls: string[] = this.getUrls();
    let arrayOfObservables = [];

    urls.forEach(u => {
      let query = this.http.get(u)
        .map(this.extractData)
        .catch(this.handleError);
      arrayOfObservables.push(query);
    });

    Observable.forkJoin(arrayOfObservables)
      .subscribe(
        data => {
          let mergedData;
          let dataAux = [];

          //avoiding empty data when having problems from Wikipedia
          data.forEach(d => {
            if(d) {
              dataAux.push(d);
            }
          });

          mergedData = [].concat.apply([], dataAux);
          this.dataStore.names = mergedData;
          this.names.next(this.dataStore.names);
        }
      );
  }

  getLocalData(): Value[] {
    return this.dataStore.values;
  }

  getInfo(): Observable<Value[]> {
    return this.values.asObservable();
  }

  getData(url): void {
    let dataTransform: Value[];
    this.http.get(url)
      .map(this.extractInfo)
      .catch(this.handleError)
      .subscribe(
        data => {
          dataTransform = Object.assign([], data);
          this.dataStore.values = this.transformData(dataTransform);
          this.values.next(this.dataStore.values);
        }
      )
    ;
  }

  getUrls(): string[] {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let url = '';

    return alphabet.map(l => {
      l === 'a' ? l = '' : l = '/' + l;
      url = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D\'https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FWikiproyecto%3ANombres_propios%2Flibro_de_los_nombres${l}\'%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22mw-content-text%22%5D%2Ful%2Fli%2Fa\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`;
      // console.log(url);
      return url;
    });
  }

  transformData(data): Value[] {
    let dataFinal: Value[];

    dataFinal = data.map(d => {
      let dataAux: Value = {
        title: '',
        total: 0,
        percentage: 0
      };

      if(!d.class) {
        d.th.forEach(cell => {
          switch (cell.id) {
            case 'Provincia':
              dataAux.title = cell.content;
              break;
            case 'total':
              dataAux.total = cell.content;
              break;
            case 'porcentaje':
              dataAux.percentage = cell.content;
          }
        });
      } else {
        dataAux.title = d.th.content.trim();
        d.td.forEach(cell => {
          if(cell.headers.match(/total/)) {
            dataAux.total = parseInt(cell.content.trim());
          } else {
            dataAux.percentage = parseFloat(cell.content.trim().replace(',','.'));
          }
        });
      }

      return dataAux;
    })

    return dataFinal;
  }


  correctName(name): string {
    name = name.replace(/(á|à|ä|â)/gi, 'a');
    name = name.replace(/(é|è|ë|ê)/gi, 'e');
    name = name.replace(/(í|ì|ï|î)/gi, 'i');
    name = name.replace(/(ó|ò|ö|ô)/gi, 'o');
    name = name.replace(/(ú|ù|ü|û)/gi, 'u');

    return name;
  }

  private extractInfo(res: Response) {
    let body = res.json();
    // console.log(body);
    if(!body.query.results) {return null;}
    return body.query.results.tr || { };
  }

  private extractData(res: Response) {
    let body = res.json();
    // console.log(body);
    if(!body.query.results) {return null;}
    return body.query.results.a || { };
  }

  private handleError(error: any) {
    // in a real world app, we might use a remote logging infrastructure
    // we'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }



}

export interface Name {
  content: string;
  class: string;
  href: string;
  title: string;
}

export interface Genre {
  value: number;
  title: string;
}

export interface Value {
  title: string;
  total: number;
  percentage: number;
}

export const GENRES: Genre[] = [
  { value: 1, title: 'Hombre' },
  { value: 6, title: 'Mujer' }
];
