import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { IForm } from '../models/form.interface';

interface FormDB extends DBSchema {
  forms: {
    key: string;
    value: IForm;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase<FormDB>>;

  constructor() {
    this.dbPromise = openDB<FormDB>('saeculum-form-builder-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('forms')) {
          db.createObjectStore('forms', { keyPath: 'id' });
        }
      },
    });
  }

  async saveForm(form: IForm): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.put('forms', form);
      // console.log('Form saved to IDB', form.id);
    } catch (error) {
      console.error('Error saving form to IDB', error);
      throw error;
    }
  }

  async getForm(id: string): Promise<IForm | undefined> {
    try {
      const db = await this.dbPromise;
      return await db.get('forms', id);
    } catch (error) {
      console.error('Error fetching form from IDB', error);
      throw error;
    }
  }
}