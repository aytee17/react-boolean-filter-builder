import React from "react"
import { IFilterCl } from "../../types"
import { Col, Button } from "antd"
import { UndoOutlined, MinusOutlined } from "@ant-design/icons"
import { ISharedConditionProps } from "./types"
import { StyledExistingConditionRow } from "./style"
import { BaseCondition } from "./BaseCondition"
import { pathToKey } from "../../services"
import { IConditionToolKit } from "../../hooks/useFilterState"

interface ExistingConditionProps extends ISharedConditionProps {
  path: Array<string | number>
  conditionToolKitFactory: (
    path: string,
    condition: IFilterCl,
  ) => IConditionToolKit
  parentRemoved?: boolean
}

const ExistingCondition: React.FC<ExistingConditionProps> = ({
  path,
  condition,
  entityOptions,
  operatorOptions,
  entities,
  conditionToolKitFactory,
  parentRemoved,
}) => {
  const keyPath = pathToKey(path)

  const {
    edit,
    remove,
    undoEdit,
    undoRemove,
    isEdited,
    toRemove,
    displayCondition,
  } = conditionToolKitFactory(keyPath, condition)

  const { entity_type, operator, value } = parentRemoved
    ? condition
    : (displayCondition ?? condition)

  return (
    <StyledExistingConditionRow
      gutter={8}
      align="bottom"
      isEdited={isEdited && !parentRemoved}
      toRemove={toRemove && !parentRemoved}
      parentRemoved={parentRemoved}
    >
      <BaseCondition
        entitityValue={entity_type}
        operatorValue={operator}
        valueValue={value}
        entityOptions={entityOptions}
        operatorOptions={operatorOptions}
        valueOptions={
          entities[displayCondition?.entity_type ?? condition.entity_type]
        }
        onChange={edit}
        disable={toRemove || parentRemoved}
      />
      <Col>
        {!parentRemoved &&
          (toRemove ? (
            <Button title="Undo Remove" onClick={undoRemove}>
              <UndoOutlined />
            </Button>
          ) : isEdited ? (
            <Button title="Undo Edit" onClick={undoEdit}>
              <UndoOutlined />
            </Button>
          ) : (
            <Button title="Remove" onClick={remove}>
              <MinusOutlined />
            </Button>
          ))}
      </Col>
    </StyledExistingConditionRow>
  )
}

export { ExistingCondition }
