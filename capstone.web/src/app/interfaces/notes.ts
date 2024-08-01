import { LabelI } from './labels';

export interface NoteI {
    id?: number
    noteTitle: string
    noteBody?: string
    pinned: boolean
    bgColor: string
    bgImage: string
    labels: LabelI[]
    trashed: boolean
}

export interface CheckboxI {
    done: boolean,
    data: any,
    id: number
}

export type UpdateKeyI = {
    [key in keyof NoteI]?: any
}

export interface NoteModelI {
    id: number
    pinned: NoteI[]
    unpinned: NoteI[]
    all: NoteI[]
    operation: {
        add(data: NoteI): Promise<any>;
        update(object: UpdateKeyI, id: number): Promise<void>;
        trash(id: number): void
        updateAllLabels(labelId: number, labelValue: string): void
    }
}
