import React from "react"
import { Space, Button } from "antd"
import { PlusOutlined, PlusSquareOutlined } from "@ant-design/icons"
import { IData } from "../types"

interface IAdditionButtonProps {
  createCondition?: (data?: IData) => void
  createFilter?: (data?: IData) => void
}

const AdditionButtons: React.FC<IAdditionButtonProps> = ({
  createCondition,
  createFilter,
}) => {
  return (
    <Space style={{ marginTop: "16px" }}>
      {createCondition && (
        <Button title="Add Condition" onClick={() => createCondition()}>
          <PlusOutlined />
        </Button>
      )}
      {createFilter && (
        <Button title="Add Group of Conditions" onClick={() => createFilter()}>
          <PlusSquareOutlined />
        </Button>
      )}
    </Space>
  )
}

export { AdditionButtons }
