import React from "react"
import { Col } from "antd"
import { Options } from "./types"
import { Record } from "./Record"
import { IData } from "../../types"

interface IBaseConditionProps {
  entitityValue: string
  operatorValue: string
  valueValue: unknown
  entityOptions: Options
  operatorOptions: Options
  valueOptions: Options
  onChange: (data: IData) => void
  disable?: boolean
}

const BaseCondition: React.FC<IBaseConditionProps> = ({
  entitityValue,
  operatorValue,
  valueValue,
  entityOptions,
  operatorOptions,
  valueOptions,
  onChange,
  disable,
}) => {
  return (
    <>
      <Col>
        <Record
          title="Entity"
          property="entity_type"
          value={entitityValue}
          options={entityOptions}
          onChange={onChange}
          width={200}
          disable={disable}
        />
      </Col>
      <Col>
        <Record
          title="Operator"
          property="operator"
          value={operatorValue}
          options={operatorOptions}
          onChange={onChange}
          width={100}
          disable={disable}
        />
      </Col>
      <Col>
        <Record
          title="Value"
          property="value"
          value={typeof valueValue === "string" ? valueValue : undefined}
          options={valueOptions}
          onChange={onChange}
          width={300}
          disable={disable}
        />
      </Col>
    </>
  )
}

export { BaseCondition }
