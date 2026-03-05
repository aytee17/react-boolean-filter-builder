import React from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { Button, Col } from "antd"
import { ISharedConditionProps } from "./types"
import { StyledNewConditionRow } from "./style"
import { BaseCondition } from "./BaseCondition"
import { IData } from "../../types"

interface NewConditionProps extends ISharedConditionProps {
  update: (data: IData) => void
  remove: () => void
  showDelete?: boolean
  isSubCondition?: boolean
}

const NewCondition: React.FC<NewConditionProps> = ({
  condition,
  entityOptions,
  operatorOptions,
  entities,
  update,
  remove,
  showDelete,
  isSubCondition,
}) => {
  const { entity_type, operator, value } = condition

  return (
    <StyledNewConditionRow
      gutter={8}
      align="bottom"
      isSubCondition={isSubCondition}
    >
      <BaseCondition
        entitityValue={entity_type}
        operatorValue={operator}
        valueValue={value}
        entityOptions={entityOptions}
        operatorOptions={operatorOptions}
        valueOptions={entities[entity_type]}
        onChange={update}
      />
      {showDelete && (
        <Col>
          <Button title="Remove Condition" type="default" onClick={remove}>
            <DeleteOutlined />
          </Button>
        </Col>
      )}
    </StyledNewConditionRow>
  )
}

export { NewCondition }
