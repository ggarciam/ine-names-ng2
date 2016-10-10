import {Component}                  from '@angular/core';
import {OnInit}                     from '@angular/core';
import {Name, Genre, NamesService, GENRES, Value}  from './names.service';
import {Observable}                 from 'rxjs';

@Component({
  selector: 'ine-names',
  template: require('./names.html')
})
export class NamesComponent implements OnInit {
  public names: Observable<Name[]>;
  public localNames: Name[];
  public selectedObject: string;
  public genres: Genre[];
  public selectedGenre: number;
  public values: Value[];

  private name: string;

  constructor(
    private namesService: NamesService,
  ) {
    this.selectedObject = '';
    this.genres = GENRES;
    this.selectedGenre = 1; // hombre preselected
  }

  ngOnInit(): void {

    this.names = this.namesService.getNames();
    this.namesService.getNames()
      .subscribe(() => {
        this.localNames = this.namesService.getLocalNames();
      });

    this.namesService.setNames();

  }

  getValues(event): void {
    let url: string,
        data: Observable<Value[]>;

    this.name = this.selectedObject;

    // remove tildes from name
    this.name = this.namesService.correctName(this.name);

    url = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D\'http%3A%2F%2Fwww.ine.es%2Ftnombres%2FformGeneralresult.do%3FL%3D0%26vista%3D1%26orig%3Dine%26cmb4%3D99%26cmb6%3D${this.name}%26cmb7%3D${this.selectedGenre}%26x%3D11%26y%3D5\'%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22formGeneral%22%5D%2Ftable%5B1%5D%2Ftbody%2Ftr%2Ftd%2Ftable%5B2%5D%2Ftbody%2Ftr%5B5%5D%2Ftd%2Ftable%2Ftbody%2Ftr\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

    this.namesService.getInfo()
      .subscribe(() => {
        this.values = this.namesService.getLocalData();
        console.log(this.values);
      });

    this.namesService.getData(url);
  }


}
