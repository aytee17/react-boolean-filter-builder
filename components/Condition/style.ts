import styled, { css } from "styled-components"
import { Row } from "antd"

const StyledExistingConditionRow = styled(Row).withConfig({
  shouldForwardProp: (prop) =>
    !["toRemove", "isEdited", "parentRemoved"].includes(prop),
})<{
  toRemove?: boolean
  isEdited?: boolean
  parentRemoved?: boolean
}>`
  ${({ isEdited, toRemove }) =>
    (isEdited || toRemove) &&
    css`
      padding: 8px;
      padding-bottom: 12px;
      max-width: -moz-fit-content;
      max-width: fit-content;
    `}

  ${({ isEdited }) =>
    isEdited &&
    css`
      background-color: #e6f7ff;
      border: 1px solid #91d5ff;
    `}

  ${({ toRemove }) =>
    toRemove &&
    css`
      background-color: #fff2f0;
      border: 1px solid #ffccc7;
    `}

  ${({ parentRemoved }) =>
    parentRemoved &&
    css`
      background-color: #fff2f0;
      border: none;
    `}
`

const StyledNewConditionRow = styled(Row).withConfig({
  shouldForwardProp: (prop) => !["isSubCondition"].includes(prop),
})<{ isSubCondition?: boolean }>`
  ${({ isSubCondition }) =>
    !isSubCondition &&
    css`
      background-color: #f6ffed;
      border: 1px solid #b7eb8f;
      padding: 8px;
      padding-bottom: 12px;
      max-width: -moz-fit-content;
      max-width: fit-content;
    `}
`

const StyledRecordContainer = styled.div<{ disabled?: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`

export {
  StyledExistingConditionRow,
  StyledNewConditionRow,
  StyledRecordContainer,
}
