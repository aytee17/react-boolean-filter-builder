import React from "react"
import { Select } from "antd"
import { StyledRecordContainer } from "./style"
import { IData } from "../../types"
const { Option } = Select

interface IRecordProps {
  title: string
  value?: string
  options: Array<{ id: string; value: string }>
  width: number
  disable?: boolean
  onChange: (data: IData) => void
  property: string
}

const Record: React.FC<IRecordProps> = ({
  title,
  property,
  value,
  options,
  onChange,
  width,
  disable = false,
}) => {
  return (
    <StyledRecordContainer disabled={disable}>
      <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.55)" }}>
        {title}
      </div>
      <Select
        value={value}
        style={{ width }}
        onChange={(newValue) => {
          onChange({
            property,
            value: newValue,
          })
        }}
      >
        {options?.map((option, index) => {
          return (
            <Option key={index} value={option.id}>
              {option.value}
            </Option>
          )
        })}
      </Select>
    </StyledRecordContainer>
  )
}

export { Record }
