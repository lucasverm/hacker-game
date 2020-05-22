import { Injectable, KeyValueDiffer, KeyValueDiffers, KeyValueChanges } from '@angular/core';
import { Regel } from '../regel';
import * as moment from 'moment';
import { Data } from '../data';
import { observe } from "rxjs-observe";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _dataSource;
  // Observable navItem stream
  dataObserver$;
  // service command
  updateData(data: Data) {
    this._dataSource.next(data);
    this.dataObserver$.subscribe(item => {
      localStorage.setItem('data', JSON.stringify(item));
    });
  }

  constructor() {
    var data = localStorage.getItem('data');
    if (data == null) {
      console.log("data is null");
      this._dataSource = new BehaviorSubject<Data>(new Data());
      this.dataObserver$ = this._dataSource.asObservable();
      this.dataObserver$.subscribe(item => {
        localStorage.setItem('data', JSON.stringify(item));
      });
    } else {
      console.log("data is niet null");
      this._dataSource = new BehaviorSubject<Data>(Data.fromJson(JSON.parse(data)));
      this.dataObserver$ = this._dataSource.asObservable();
    };
  }

}
