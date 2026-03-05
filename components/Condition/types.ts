import { IFilterCl, IEntities } from "../../types"

type Options = Array<{ id: string; value: string }>

interface ISharedConditionProps {
  condition: IFilterCl
  entities: IEntities
  entityOptions: Options
  operatorOptions: Options
}

export type { Options, ISharedConditionProps }
