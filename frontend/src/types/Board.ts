export type Task = {
    id: string;
    content: string;
    completed: boolean;
}

export type ColumnType = "todo" | "inProgress" | "done";

export type Columns = {
    [key in ColumnType]: {
        name: string;
        items: Task[];
    };
};

export type Board = {
    id: string;
    name: string;
    columns: Columns;
}