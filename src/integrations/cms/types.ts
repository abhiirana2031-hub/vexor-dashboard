export type WixDataItem = {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  [key: string]: unknown;
};

export type WixDataQueryResult = {
  items: WixDataItem[];
  totalCount: number;
};
