import styled, { css } from "styled-components"
import { Card, Typography } from "antd"

const StyledCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => !["disabled"].includes(prop),
})<{ disabled: boolean }>`
  margin: 8px 0;

  ${({ disabled }) =>
    disabled &&
    css`
      border: 1px solid #ffccc7;
      background-color: #fff2f0;
    `};
`

const OperatorText = styled(Typography.Text).withConfig({
  shouldForwardProp: (prop) => !["fade"].includes(prop),
})<{ fade?: boolean }>`
  display: block;
  margin: 8px 0;
  font-style: italic;
  font-weight: bold;
  text-transform: uppercase;

  ${({ fade }) =>
    fade &&
    css`
      opacity: 0.5;
    `}
`

export { StyledCard, OperatorText }
