import React from "react"
import { Select, Button } from "antd"
import { MinusOutlined, UndoOutlined } from "@ant-design/icons"
import { translateOperator } from "./helper"
import { OperatorContainer, SelectionContainer } from "./style"
import { pathToKey } from "../../services"
import { IOperatorToolKit } from "../../hooks/useFilterState"

const { Option } = Select

interface IHeadingProps {
  isSubQuery?: boolean
  operator: string
  path: Array<string | number>
  createOperatorToolKit: (path: string, operator: string) => IOperatorToolKit
  parentRemoved?: boolean
}

const ExistingOperator: React.FC<IHeadingProps> = ({
  isSubQuery,
  operator,
  path,
  createOperatorToolKit,
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
  } = createOperatorToolKit(keyPath, operator)

  const removed = parentRemoved || toRemove

  return (
    <OperatorContainer isEdited={isEdited && !parentRemoved}>
      <SelectionContainer removed={removed}>
        <div style={{ marginRight: "8px" }}>
          {!isSubQuery ? "Select people that meet " : "Meets"}
        </div>
        <span style={{ fontWeight: "bold" }}>
          <Select
            value={parentRemoved ? operator : displayOperator}
            style={{ width: "70px" }}
            onChange={edit}
          >
            <Option value="or">{translateOperator("or")}</Option>
            <Option value="and">{translateOperator("and")}</Option>
          </Select>
        </span>
        <div style={{ marginLeft: "8px" }}>of the following conditions</div>
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
