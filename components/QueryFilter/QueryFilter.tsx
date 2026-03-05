import React from "react"
import { IFilterExpr, IFilterCl, Entities } from "../../types"
import {
  IAdditionToolKit,
  IConditionToolKit,
  IOperatorToolKit,
} from "../../hooks/useFilterState"
import { ExistingOperator } from "../Operator"
import { ConditionList } from "./ConditionList"
import { pathToKey } from "../../services"
import { StyledCard } from "./style"
import { IAddition } from "../../hooks/useFilterState"

interface IQueryFilterProps {
  filters?: IFilterExpr
  entities: Entities
  operatorOptions: Array<{ id: string; value: string }>
  entitiyOptions: Array<{ id: string; value: string }>
  isSubQuery?: boolean
  path?: Array<string | number>
  additions: IAddition
  createAdditionToolKit: (path: string) => IAdditionToolKit
  createConditionToolKit: (
    path: string,
    condition: IFilterCl,
  ) => IConditionToolKit
  createOperatorToolKit: (path: string, operator: string) => IOperatorToolKit
  parentRemoved?: boolean
}

const QueryFilter: React.FC<IQueryFilterProps> = ({
  entities,
  filters,
  isSubQuery,
  entitiyOptions,
  operatorOptions,
  path = [],
  additions,
  createAdditionToolKit,
  createConditionToolKit,
  createOperatorToolKit,
  parentRemoved,
}) => {
  if (filters) {
    const [[operator, conditions]] = Object.entries(filters)
    const extendedPath = [...path, "filters", operator]
    const pathKey = pathToKey(extendedPath)

    const { toRemove } = createOperatorToolKit(pathKey, operator)
    const removed = parentRemoved || toRemove
    return (
      <StyledCard disabled={removed}>
        <div style={{ marginLeft: !isSubQuery ? "16px" : "none" }}>
          <ExistingOperator
            isSubQuery={isSubQuery}
            operator={operator}
            path={extendedPath}
            createOperatorToolKit={createOperatorToolKit}
            parentRemoved={parentRemoved}
          />
          <ConditionList
            conditions={conditions}
            additions={additions}
            entities={entities}
            entitiyOptions={entitiyOptions}
            operatorOptions={operatorOptions}
            operator={operator}
            path={extendedPath}
            createAdditionToolKit={createAdditionToolKit}
            createConditionToolKit={createConditionToolKit}
            createOperatorToolKit={createOperatorToolKit}
            parentRemoved={removed}
          />
        </div>
      </StyledCard>
    )
  }
  return <></>
}

export { QueryFilter }
