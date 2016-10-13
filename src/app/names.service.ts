import {Injectable}       from '@angular/core';
import {Http, Response}   from '@angular/http';

import {Observable}       from 'rxjs/Observable';
import {Subject}          from 'rxjs';

@Injectable()
export class NamesService {
  private names: Subject<Name[]>; // array of all names extracted from Wikipedia
  private values: Subject<Value[]>; // array of all values for a name extracted from INE
  private dataStore: {
    names: Name[],
    values: Value[]
  };
  private provinces: Province[];

  constructor(
    private http: Http
  ) {
    this.dataStore = {names: [], values: []};
    this.names = <Subject<Name[]>>new Subject();
    this.values = <Subject<Value[]>>new Subject();
    this.provinces = PROVINCES;
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

          // avoiding empty data when having problems from Wikipedia
          data.forEach(d => {
            if (d) {
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

  getProvinceId(name): string {
    let id: string = '';

    this.provinces.forEach(p => {
      if (p.title === name) {
        id =  p.id;
      }
    });
    return id;
  }

  transformData(data): Value[] {
    let dataFinal: Value[];

    dataFinal = data.map(d => {
      let dataAux: Value = {
        title: '',
        total: 0,
        percentage: 0,
        id: ''
      };

      if (!d.class) {
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
        dataAux.id = this.getProvinceId(dataAux.title);
        d.td.forEach(cell => {
          if (cell.headers.match(/total/)) {
            dataAux.total = parseInt(cell.content.trim());
          } else {
            dataAux.percentage = parseFloat(cell.content.trim().replace(',', '.'));
          }
        });
      }

      return dataAux;
    });

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
    if (!body.query.results) { return null; }
    return body.query.results.tr || {};
  }

  private extractData(res: Response) {
    let body = res.json();
    // console.log(body);
    if (!body.query.results) { return null; }
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
  id: string;
}

export interface Province {
  id: string;
  title: string;
}

export interface Area {
  id: string;
  value: number;
}

export const GENRES: Genre[] = [
  { value: 1, title: 'Hombre' },
  { value: 6, title: 'Mujer' }
];

export const PROVINCES: Province[] = [
  {
    'id': 'ES-A',
    'title': 'Alicante/Alacant',
  },
  {
    'id': 'ES-AB',
    'title': 'Albacete',
  },
  {
    'id': 'ES-AL',
    'title': 'Almería',
  },
  {
    'id': 'ES-AV',
    'title': 'Ávila',
  },
  {
    'id': 'ES-B',
    'title': 'Barcelona',
  },
  {
    'id': 'ES-BA',
    'title': 'Badajoz',
  },
  {
    'id': 'ES-BI',
    'title': 'Bizkaia',
  },
  {
    'id': 'ES-BU',
    'title': 'Burgos',
  },
  {
    'id': 'ES-C',
    'title': 'Coruña, A',
  },
  {
    'id': 'ES-CA',
    'title': 'Cádiz',
  },
  {
    'id': 'ES-CC',
    'title': 'Cáceres',
  },
  {
    'id': 'ES-CE',
    'title': 'Ceuta',
  },
  {
    'id': 'ES-CO',
    'title': 'Córdoba',
  },
  {
    'id': 'ES-CR',
    'title': 'Ciudad Real',
  },
  {
    'id': 'ES-CS',
    'title': 'Castellón/Castelló',
  },
  {
    'id': 'ES-CU',
    'title': 'Cuenca',
  },
  {
    'id': 'ES-GC',
    'title': 'Palmas, Las',
  },
  {
    'id': 'ES-GI',
    'title': 'Girona',
  },
  {
    'id': 'ES-GR',
    'title': 'Granada',
  },
  {
    'id': 'ES-GU',
    'title': 'Guadalajara',
  },
  {
    'id': 'ES-H',
    'title': 'Huelva',
  },
  {
    'id': 'ES-HU',
    'title': 'Huesca',
  },
  {
    'id': 'ES-J',
    'title': 'Jaén',
  },
  {
    'id': 'ES-L',
    'title': 'Lleida',
  },
  {
    'id': 'ES-LE',
    'title': 'León',
  },
  {
    'id': 'ES-LO',
    'title': 'Rioja, La',
  },
  {
    'id': 'ES-LU',
    'title': 'Lugo',
  },
  {
    'id': 'ES-M',
    'title': 'Madrid',
  },
  {
    'id': 'ES-MA',
    'title': 'Málaga',
  },
  {
    'id': 'ES-ML',
    'title': 'Melilla',
  },
  {
    'id': 'ES-MU',
    'title': 'Murcia',
  },
  {
    'id': 'ES-NA',
    'title': 'Navarra',
  },
  {
    'id': 'ES-O',
    'title': 'Asturias',
  },
  {
    'id': 'ES-OR',
    'title': 'Ourense',
  },
  {
    'id': 'ES-P',
    'title': 'Palencia',
  },
  {
    'id': 'ES-PM',
    'title': 'Balears, Illes',
  },
  {
    'id': 'ES-PO',
    'title': 'Pontevedra',
  },
  {
    'id': 'ES-S',
    'title': 'Cantabria',
  },
  {
    'id': 'ES-SA',
    'title': 'Salamanca',
  },
  {
    'id': 'ES-SE',
    'title': 'Sevilla',
  },
  {
    'id': 'ES-SG',
    'title': 'Segovia',
  },
  {
    'id': 'ES-SO',
    'title': 'Soria',
  },
  {
    'id': 'ES-SS',
    'title': 'Gipuzkoa',
  },
  {
    'id': 'ES-TE',
    'title': 'Teruel',
  },
  {
    'id': 'ES-TF',
    'title': 'Santa Cruz de Tenerife',
  },
  {
    'id': 'ES-TO',
    'title': 'Toledo',
  },
  {
    'id': 'ES-T',
    'title': 'Tarragona',
  },
  {
    'id': 'ES-V',
    'title': 'Valencia/València',
  },
  {
    'id': 'ES-VA',
    'title': 'Valladolid',
  },
  {
    'id': 'ES-VI',
    'title': 'Araba/Álava',
  },
  {
    'id': 'ES-Z',
    'title': 'Zaragoza',
  },
  {
    'id': 'ES-ZA',
    'title': 'Zamora',
  }
];
