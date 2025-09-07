export interface ICategory {
    _id?: string;
    name: string;
    route: string;
    isActive?: boolean;
}

export interface ICategoriesRes {
    message: string;
    data: ICategory[];
}
