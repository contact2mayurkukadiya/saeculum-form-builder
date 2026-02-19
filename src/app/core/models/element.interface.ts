import { FormElementType, QuestionType } from '../enums/question-type';

export interface IElement {
    id: string;
    type: FormElementType;
    label: string;

    // Section specific
    children?: IElement[];
    isExpanded?: boolean;

    // Question specific
    questionType?: QuestionType;
    required?: boolean;
    value?: string | boolean; // For preview/answer

    // Metadata
    parentId?: string | null;
}