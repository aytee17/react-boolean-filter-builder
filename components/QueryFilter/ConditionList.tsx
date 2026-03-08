import React from "react"
import { IFilterCl, IFilterExpr, isIFilterCl, Entities } from "../../types"
import {
  IAdditionToolKit,
  IConditionToolKit,
  IOperatorToolKit,
} from "../../hooks/useFilterState"
import { QueryFilter } from "./QueryFilter"
import { AdditionButtons } from "../AdditionButtons"
import { NewCondition, ExistingCondition } from "../Condition"
import { NewQueryFilter } from "./NewQueryFilter"
import { pathToKey } from "../../services"
import { OperatorText } from "./style"
import { IAddition } from "../../hooks/useFilterState"

interface IConditionListProps {
  conditions: [IFilterCl | { filters: IFilterExpr }]
  entities: Entities
  operatorOptions: Array<{ id: string; value: string }>
  entitiyOptions: Array<{ id: string; value: string }>
  path: Array<string | number>
  operator: string
  additions: IAddition
  additionToolKitFactory: (path: string) => IAdditionToolKit
  conditionToolKitFactory: (
    path: string,
    condition: IFilterCl,
  ) => IConditionToolKit
  operatorToolKitFactory: (path: string, operator: string) => IOperatorToolKit
  parentRemoved?: boolean
}

const ConditionList: React.FC<IConditionListProps> = ({
  conditions,
  entities,
  entitiyOptions,
  operatorOptions,
  path,
  operator,
  additions,
  additionToolKitFactory,
  conditionToolKitFactory,
  operatorToolKitFactory,
  parentRemoved,
}) => {
  const pathKey = pathToKey(path)
  const additionsForCurrentPath = additions[pathKey]

  const additionToolKit = additionToolKitFactory(pathKey)
  const { displayOperator, toRemove } = operatorToolKitFactory(
    pathKey,
    operator,
  )
  const removed = parentRemoved || toRemove

  return (
    <>
      {conditions.map((condition, conditionIndex) => {
        const newPath = [...path, conditionIndex]
        return (
          <React.Fragment key={conditionIndex}>
            {isIFilterCl(condition) ? (
              <ExistingCondition
                condition={condition}
                entities={entities}
                entityOptions={entitiyOptions}
                operatorOptions={operatorOptions}
                path={newPath}
                conditionToolKitFactory={conditionToolKitFactory}
                parentRemoved={removed}
              />
            ) : (
              <QueryFilter
                path={newPath}
                key={conditionIndex}
                additions={additions}
                entities={entities}
                filters={condition.filters}
                entitiyOptions={entitiyOptions}
                operatorOptions={operatorOptions}
                isSubQuery
                additionToolKitFactory={additionToolKitFactory}
                conditionToolKitFactory={conditionToolKitFactory}
                operatorToolKitFactory={operatorToolKitFactory}
                parentRemoved={removed}
              />
            )}
            {(conditionIndex !== conditions.length - 1 ||
              (!removed && additionsForCurrentPath?.length > 0)) && (
              <OperatorText fade={removed}>{displayOperator}</OperatorText>
            )}
          </React.Fragment>
        )
      })}
      {!removed &&
        additionsForCurrentPath?.map((addition, additionIndex) => {
          const newPath = [additionIndex]
          const { createPropertyUpdater, createDeleter } = additionToolKit
          return (
            <React.Fragment key={additionIndex}>
              {isIFilterCl(addition) ? (
                <NewCondition
                  condition={addition as IFilterCl}
                  entities={entities}
                  entityOptions={entitiyOptions}
                  operatorOptions={operatorOptions}
                  update={createPropertyUpdater(newPath)}
                  remove={createDeleter(newPath)}
                  showDelete
                />
              ) : (
                <NewQueryFilter
                  showDelete
                  path={newPath}
                  key={additionIndex}
                  entities={entities}
                  filters={addition.filters}
                  entitiyOptions={entitiyOptions}
                  operatorOptions={operatorOptions}
                  additionToolKit={additionToolKit}
                />
              )}
              {additionIndex !== additionsForCurrentPath.length - 1 && (
                <OperatorText>{displayOperator}</OperatorText>
              )}
            </React.Fragment>
          )
        })}
      {!removed && (
        <AdditionButtons
          createCondition={additionToolKit.createConditionAdder([])}
          createFilter={additionToolKit.createFilterAdder([])}
        />
      )}
    </>
  )
}

export { ConditionList }
