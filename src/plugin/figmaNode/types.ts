export type GeneratedCodeType = {
  code: string;
  story: string;
};

export type OriginalNodeTree = {
  id: string;
  name: string;
  children?: OriginalNodeTree[];
};

export type SavedGqlQuery = {
  originalQuery: string;
  editingMode: 'query' | 'fragment';
};
