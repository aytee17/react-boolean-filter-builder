import styled, { css } from "styled-components"

const OperatorContainer = styled.div<{ isEdited: boolean }>`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 8px;

  ${({ isEdited }) =>
    isEdited &&
    css`
      border: 1px solid #91d5ff;
      background-color: #e6f7ff;
      padding: 8px;
    `}
`

const SelectionContainer = styled.div<{ removed?: boolean }>`
  ${({ removed }) =>
    removed &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  display: flex;
  align-items: baseline;
  font-style: italic;
`

export { OperatorContainer, SelectionContainer }
