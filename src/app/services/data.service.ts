import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Data } from '../data';

@Injectable({
  providedIn: "root",
})
export class DataService {
  public dataSource$;
  // Observable navItem stream
  // service command
  updateData(data: Data) {
    this.dataSource$.next(data);
  }

  constructor() {
    var data = localStorage.getItem("data");
    if (data == null) {
      this.dataSource$ = new BehaviorSubject<Data>(new Data());
      //this.dataObserver$ = this._dataSource$.asObservable();
    } else {
      this.dataSource$ = new BehaviorSubject<Data>(
        Data.fromJson(JSON.parse(data))
      );
      //this.dataObserver$ = this._dataSource$.asObservable();
    }

    this.dataSource$.subscribe((item) => {
      console.log("trigger setData");
      localStorage.setItem("data", JSON.stringify(item));
    });
  }
}
