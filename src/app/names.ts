import {Component, ElementRef, Inject}              from '@angular/core';
import {OnInit}                                     from '@angular/core';
import {Name, Genre, NamesService, GENRES, Value, Area}   from './names.service';
import {Observable}                                 from 'rxjs';

declare var AmCharts: any;

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
  public spinnerNames: boolean;
  public spinnerValues: boolean;
  private name: string;
  private AmCharts: any;

  constructor(
    private namesService: NamesService,
    private elementRef:ElementRef,
    @Inject('Window') private _window: Window
  ) {
    this.selectedObject = '';
    this.genres = GENRES;
    this.selectedGenre = 1; // hombre preselected
    this.localNames = [];
    this.spinnerNames = false;
    this.spinnerValues = false;
  }

  ngOnInit(): void {

    this.spinnerNames = true;

    this.names = this.namesService.getNames();
    this.namesService.getNames()
      .subscribe(() => {
        this.localNames = this.namesService.getLocalNames();
        this.spinnerNames = false;
      });

    this.namesService.setNames();

    this.AmCharts = AmCharts;

  }

  getValues(): void {
    let url: string;
    let areas: Area[];
    let AmCharts: any;

    this.spinnerValues = true;
    this.name = this.selectedObject;

    // remove tildes from name
    this.name = this.namesService.correctName(this.name);

    url = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D\'http%3A%2F%2Fwww.ine.es%2Ftnombres%2FformGeneralresult.do%3FL%3D0%26vista%3D1%26orig%3Dine%26cmb4%3D99%26cmb6%3D${this.name}%26cmb7%3D${this.selectedGenre}%26x%3D11%26y%3D5\'%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22formGeneral%22%5D%2Ftable%5B1%5D%2Ftbody%2Ftr%2Ftd%2Ftable%5B2%5D%2Ftbody%2Ftr%5B5%5D%2Ftd%2Ftable%2Ftbody%2Ftr\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

    this.namesService.getData(url);

    this.namesService.getInfo()
      .subscribe(() => {

        this.values = this.namesService.getLocalData();
        console.log(this.values);
        this.spinnerValues = false;

        let areas: Area[],
            values: Number[],
            minValue: Number,
            maxValue: Number;


        areas = this.values.map(v => {
          let areaAux: Area = {
            id: '',
            value: ''
          };
          areaAux.id = v.id;
          areaAux.value = v.total.toString();
          if (areaAux.id !== '') { return areaAux; }
        });

        //remove two first empty values
        areas.shift();
        areas.shift();

        values = areas.map(a => {
          return parseInt(a.value);
        });
        minValue = Math.min.apply(Math, values);
        maxValue = Math.max.apply(Math, values);

        var map;

        AmCharts = this.AmCharts;

        map = new AmCharts.AmMap();

        map.colorSteps = 10;

        var dataProvider = {
          mapVar: AmCharts.maps.spainProvincesLow,
          areas: areas
        };

        map.areasSettings = {
          autoZoom: true
        };
        map.dataProvider = dataProvider;

        var valueLegend = new AmCharts.ValueLegend();
        valueLegend.right = 10;
        valueLegend.minValue = minValue;
        valueLegend.maxValue = maxValue;
        map.valueLegend = valueLegend;

        map.write("mapdiv");

      });
  }
}
