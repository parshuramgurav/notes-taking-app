import { LabelI } from './../interfaces/labels';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private BASE_URL = environment.BASE_URL;

  private labelsListSubject = new BehaviorSubject<LabelI[]>([]);
  labelsList$: Observable<LabelI[]> = this.labelsListSubject.asObservable();

  constructor(private http: HttpClient) { }

  private updateLabelsList(labels: LabelI[]) {
    this.labelsListSubject.next(labels);
  }

  async get() {
    try {
      const response = await this.http.get<LabelI[]>(`${this.BASE_URL}/categories`).toPromise();
      if(response){
        this.updateLabelsList(response.filter((label: any) => !label.trashed));
      }
    }
    catch (error) {
      console.log(console.error);
    }
  }

  async add(labelObj: LabelI) {
    try {
      const response = await this.http.post<LabelI>(`${this.BASE_URL}/categories`, { ...labelObj, trashed: false }).toPromise();
      if (response) {
        this.updateLabelsList([...this.labelsListSubject.value, response]);
      }
    }
    catch (error) {
      console.log(console.error);
    }
  }

  async delete(id: number) {
    try {
      await this.http.patch<LabelI>(`${this.BASE_URL}/categories/${id}`, { trashed: true }).toPromise();
      this.updateLabelsList(this.labelsListSubject.value.filter((label: any) => label.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  async update(object: LabelI, id: number) {
    try {
      await this.http.patch<LabelI>(`${this.BASE_URL}/categories/${id}`, object).toPromise();
      const labels = this.labelsListSubject.value.map((label: any) => {
        if (label.id === id) {
          return { ...label, ...object };
        }
        return label;
      });
      this.updateLabelsList(labels);
    } catch (error) {
      console.log(error);
    }
  }
}