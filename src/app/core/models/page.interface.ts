import { IElement } from './element.interface';

export interface IPage {
    id: string;
    title: string;
    elements: IElement[]; // Top level elements (Questions or Sections)
}