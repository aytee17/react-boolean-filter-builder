import React from "react"
import { Select, Button } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { SelectionContainer, OperatorContainer } from "./style"
import { translateOperator } from "./helper"
import { IData } from "../../types"

const { Option } = Select

interface INewHeadingProps {
  operator: string
  keyUpdater: (data: IData) => void
  onDelete: () => void
  showDelete: boolean
}

const NewOperator: React.FC<INewHeadingProps> = ({
  operator,
  keyUpdater,
  onDelete,
  showDelete,
}) => {
  return (
    <OperatorContainer isEdited={false}>
      <SelectionContainer>
        <div style={{ marginRight: "8px" }}>Meets</div>
        <span style={{ fontWeight: "bold" }}>
          <Select
            defaultValue={operator}
            style={{ width: "70px" }}
            onChange={(newOperator) => {
              keyUpdater({ property: newOperator, value: null })
            }}
          >
            <Option value="or">{translateOperator("or")}</Option>
            <Option value="and">{translateOperator("and")}</Option>
          </Select>
        </span>
        <div style={{ marginLeft: "8px" }}>of the following conditions</div>
      </SelectionContainer>
      {showDelete && (
        <Button onClick={onDelete}>
          <DeleteOutlined />
        </Button>
      )}
    </OperatorContainer>
  )
}

export { NewOperator }
