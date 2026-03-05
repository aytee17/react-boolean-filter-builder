interface IData {
  property: string
  value: any
}

interface IFilterCl {
  entity_type: string
  entity_field: string
  operator: string
  value: string
}

interface IFilterExpr {
  [operator: string]: Array<IFilterCl | IFilter>
}

interface IFilter {
  filters: IFilterExpr
}

type Entity = string

type Entities = Record<Entity, Array<{ id: string }>>

// IEntities is an alias kept for compatibility with Condition/types.ts
type IEntities = Entities

const isIFilterCl = (item: IFilterCl | IFilter): item is IFilterCl => {
  return "entity_type" in item
}

export type {
  IData,
  IFilterCl,
  IFilterExpr,
  IFilter,
  Entity,
  Entities,
  IEntities,
}
export { isIFilterCl }
