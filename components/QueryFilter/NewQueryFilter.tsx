import React from "react"
import { IFilterExpr, IFilterCl, isIFilterCl, IFilter, Entities } from "../../types"
import { NewOperator } from "../Operator"
import { NewCondition } from "../Condition"
import { AdditionButtons } from "../AdditionButtons"
import { StyledNewQueryFilterContainer, StyledConditionList } from "../../style"
import { OperatorText } from "./style"
import { IAdditionToolKit } from "../../hooks/useFilterState"

interface INewQueryFilterProps {
  path: Array<string | number>
  filters?: IFilterExpr
  entities: Entities
  entitiyOptions: Array<{ id: string; value: string }>
  operatorOptions?: Array<{ id: string; value: string }>
  showDelete?: boolean
  additionToolKit: IAdditionToolKit
}

const defaultOperatorOptions = [
  { id: "is", value: "is" },
  { id: "is_not", value: "is not" },
]

const NewQueryFilter: React.FC<INewQueryFilterProps> = ({
  path,
  filters,
  entities,
  entitiyOptions,
  operatorOptions = defaultOperatorOptions,
  showDelete = true,
  additionToolKit,
}) => {
  if (filters) {
    const [[operator, conditions]] = Object.entries(filters)
    const onlyOne = conditions.length === 1
    const extendedPath: Array<string | number> = [...path, "filters", operator]

    const {
      createFilterAdder,
      createConditionAdder,
      createPropertyUpdater,
      createKeyUpdater,
      createDeleter,
    } = additionToolKit

    return (
      <StyledNewQueryFilterContainer>
        <NewOperator
          showDelete={showDelete}
          operator={operator}
          keyUpdater={createKeyUpdater([...path, "filters"])}
          onDelete={createDeleter(path)}
        />
        <StyledConditionList>
          {conditions.map(
            (addition: IFilterCl | IFilter, additionIndex: number) => {
              const newPath = [...extendedPath, additionIndex]
              return (
                <React.Fragment key={additionIndex}>
                  {isIFilterCl(addition) ? (
                    <NewCondition
                      condition={addition}
                      entities={entities}
                      entityOptions={entitiyOptions}
                      operatorOptions={operatorOptions}
                      update={createPropertyUpdater(newPath)}
                      remove={createDeleter(newPath)}
                      showDelete={!onlyOne}
                      isSubCondition
                    />
                  ) : (
                    <NewQueryFilter
                      path={newPath}
                      filters={addition.filters}
                      entities={entities}
                      entitiyOptions={entitiyOptions}
                      operatorOptions={operatorOptions}
                      showDelete={!onlyOne}
                      additionToolKit={additionToolKit}
                    />
                  )}
                  {additionIndex !== conditions.length - 1 && (
                    <OperatorText>{operator}</OperatorText>
                  )}
                </React.Fragment>
              )
            },
          )}
          <AdditionButtons
            createCondition={createConditionAdder(extendedPath)}
            createFilter={createFilterAdder(extendedPath)}
          />
        </StyledConditionList>
      </StyledNewQueryFilterContainer>
    )
  }
  return <></>
}

export { NewQueryFilter }
