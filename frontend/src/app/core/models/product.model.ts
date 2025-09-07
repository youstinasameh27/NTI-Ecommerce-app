export interface IVariant {
    _id?: string;
    key: string; // Size:M|Color:Black
    stock: number;
}

export interface IOption {
    name: string;
    values: string[];
}

export interface IProduct {
    _id?: string;
    title: string;
    desc?: string;
    price: number;
    imgURL: string;
    route: string;
    stock?: number;
    options?: IOption[];
    variants?: IVariant[];
    categoryId?: string | null;
    subCategoryId?: string | null;
}

export interface IProductsRes {
    data: IProduct[];
    message: string;
}

export interface IProductRes {
    data: IProduct;
    message: string;
}
