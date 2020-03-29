export interface Todo {
    id: number,
    name: string,
    description: string,
    created_at: Date
}

export type AddTodo = (name: string, description: string) => void
export type RemoveTodo = (id: number) => void
export type EditTodo = (id: number, name: string, description: string) => void