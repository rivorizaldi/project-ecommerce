interface ISlug {
  current: string;
}

export default interface IProduct {
  _id: string;
  details?: string;
  name?: string;
  price?: number;
  image?: Array<any>;
  slug?: ISlug;
  quantity?: number;
}
