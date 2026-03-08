import React from "react"
import { IFilterExpr, Entities } from "./types"
import { QueryFilter } from "./components/QueryFilter/QueryFilter"
import { IFilterState } from "./hooks/useFilterState"

interface IFilterProps {
  filters: IFilterExpr
  path?: Array<string | number>
  entities: Entities
  filterState: IFilterState
  entityOptions: Array<{ id: string; value: string }>
  operatorOptions: Array<{ id: string; value: string }>
}

const Filter: React.FC<IFilterProps> = ({
  entities,
  filters,
  path = [],
  filterState,
  entityOptions,
  operatorOptions,
}) => {
  const {
    additions,
    additionToolKitFactory,
    operatorToolKitFactory,
    conditionToolKitFactory,
  } = filterState

  return (
    <QueryFilter
      path={path}
      filters={filters}
      additions={additions}
      entities={entities}
      entitiyOptions={entityOptions}
      operatorOptions={operatorOptions}
      conditionToolKitFactory={conditionToolKitFactory}
      additionToolKitFactory={additionToolKitFactory}
      operatorToolKitFactory={operatorToolKitFactory}
    />
  )
}

export { Filter }
