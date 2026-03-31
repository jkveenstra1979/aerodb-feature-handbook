export type Attr = {
  name: string;
  type: string;
  status: 'req' | 'opt' | 'cond';
  desc: string;
  uom: string | null;
  aixm: string | null;
};

export type Relation = {
  name: string;
  label: string;
  type?: string | null;
};

export type Mapping = {
  aerodb: string;
  aixm: string;
  table: string;
  column: string;
};

export type Ownership = {
  attr: string;
  provider: string;
  originator: string;
  dpa: boolean;
};

export type Adis = {
  module: string;
  attrs: string[];
  reqAll: boolean;
};

export type Feature = {
  id: string;
  code: string;
  iconClass: string;
  name: string;
  description: string;
  badges: string[];
  aixmMapped: boolean;
  group: string;
  attrs: Attr[];
  relations: {
    parent: Relation[];
    children: Relation[];
    spatial: Relation[];
    logical: Relation[];
  };
  mapping: Mapping[];
  ownership: Ownership[];
  adis: Adis[];
};
