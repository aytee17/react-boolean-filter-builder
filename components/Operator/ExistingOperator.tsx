import React from "react"
import { Select, Button } from "antd"
import { MinusOutlined, UndoOutlined } from "@ant-design/icons"
import { OperatorContainer, SelectionContainer } from "./style"
import { pathToKey } from "../../services"
import { IOperatorToolKit } from "../../hooks/useFilterState"

const { Option } = Select

interface IHeadingProps {
  isSubQuery?: boolean
  operator: string
  path: Array<string | number>
  operatorToolKitFactory: (path: string, operator: string) => IOperatorToolKit
  parentRemoved?: boolean
}

const ExistingOperator: React.FC<IHeadingProps> = ({
  isSubQuery,
  operator,
  path,
  operatorToolKitFactory,
  parentRemoved,
}) => {
  const keyPath = pathToKey(path)

  const {
    isEdited,
    edit,
    displayOperator,
    toRemove,
    undoRemove,
    remove,
    undoEdit,
  } = operatorToolKitFactory(keyPath, operator)

  const removed = parentRemoved || toRemove

  return (
    <OperatorContainer isEdited={isEdited && !parentRemoved}>
      <SelectionContainer removed={removed}>
        <Select
          value={parentRemoved ? operator : displayOperator}
          style={{ width: "75px" }}
          onChange={edit}
        >
          <Option value="or">OR</Option>
          <Option value="and">AND</Option>
        </Select>
      </SelectionContainer>
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
          isSubQuery && (
            <Button title="Remove" onClick={remove}>
              <MinusOutlined />
            </Button>
          )
        ))}
    </OperatorContainer>
  )
}

export { ExistingOperator }
