export interface LabelI {
    id?: number
    name: string
    added?: boolean
    trashed?: boolean
}

export type LabelActionsT = {
    update: (data: string) => void
    delete: (id: number) => void
}

export type UpdateKeyI = {
    [key in keyof LabelI]?: any
}

export interface LabelModelI {
    id: number
    list: LabelI[]
    operation: {
        add(data: LabelI): Promise<any>
        update(data: UpdateKeyI, id: number): void
        delete(id: number): void
        updateAllLabels(id: number, value: string): void
    }
}