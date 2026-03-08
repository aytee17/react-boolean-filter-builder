import React from "react"
import { Select, Button } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { SelectionContainer, OperatorContainer } from "./style"
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
        <Select
          defaultValue={operator}
          style={{ width: "75px" }}
          onChange={(newOperator) => {
            keyUpdater({ property: newOperator, value: null })
          }}
        >
          <Option value="or">OR</Option>
          <Option value="and">AND</Option>
        </Select>
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
