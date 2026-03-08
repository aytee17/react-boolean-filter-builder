import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Filter } from "../Filter"
import { useFilterState } from "../hooks/useFilterState"
import type { IFilterExpr, Entities } from "../types"

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const entities: Entities = {
  employee: [{ id: "alice" }, { id: "bob" }, { id: "carol" }, { id: "dave" }],
  department: [
    { id: "engineering" },
    { id: "design" },
    { id: "product" },
    { id: "sales" },
  ],
  role: [
    { id: "admin" },
    { id: "manager" },
    { id: "contributor" },
    { id: "viewer" },
  ],
}

const entityOptions = [
  { id: "employee", value: "Employee" },
  { id: "department", value: "Department" },
  { id: "role", value: "Role" },
]

const operatorOptions = [
  { id: "is", value: "is" },
  { id: "is_not", value: "is not" },
]

// ---------------------------------------------------------------------------
// Wrapper — needed because Filter requires filterState from the hook
// ---------------------------------------------------------------------------

interface StoryWrapperProps {
  filters: IFilterExpr
}

const StatePanel: React.FC<{ label: string; value: unknown }> = ({
  label,
  value,
}) => (
  <div style={{ marginTop: "8px" }}>
    <div
      style={{ fontSize: "11px", fontWeight: 600, color: "#888", marginBottom: "4px" }}
    >
      {label}
    </div>
    <pre
      style={{
        margin: 0,
        padding: "10px 12px",
        background: "#f5f5f5",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        fontSize: "12px",
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  </div>
)

const StoryWrapper: React.FC<StoryWrapperProps> = ({ filters }) => {
  const filterState = useFilterState(entities)
  const { edits, removals, additions, boolOpEdits, boolOpRemovals } = filterState
  return (
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      <Filter
        filters={filters}
        entities={entities}
        filterState={filterState}
        entityOptions={entityOptions}
        operatorOptions={operatorOptions}
      />
      <div
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>
          Staged changes
        </div>
        <StatePanel label="edits" value={edits} />
        <StatePanel label="removals" value={removals} />
        <StatePanel label="additions" value={additions} />
        <StatePanel label="boolOpEdits" value={boolOpEdits} />
        <StatePanel label="boolOpRemovals" value={boolOpRemovals} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof StoryWrapper> = {
  title: "Filter",
  component: StoryWrapper,
}

export default meta
type Story = StoryObj<typeof StoryWrapper>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * A single condition using AND logic — the simplest possible filter.
 */
export const SingleCondition: Story = {
  name: "Single condition",
  args: {
    filters: {
      and: [
        {
          entity_type: "employee",
          entity_field: "id",
          operator: "is",
          value: "alice",
        },
      ],
    },
  },
}

/**
 * Multiple conditions joined with AND — "all of these must match".
 */
export const MultipleAndConditions: Story = {
  name: "Multiple AND conditions",
  args: {
    filters: {
      and: [
        {
          entity_type: "employee",
          entity_field: "id",
          operator: "is",
          value: "alice",
        },
        {
          entity_type: "department",
          entity_field: "id",
          operator: "is",
          value: "engineering",
        },
        {
          entity_type: "role",
          entity_field: "id",
          operator: "is_not",
          value: "viewer",
        },
      ],
    },
  },
}

/**
 * Multiple conditions joined with OR — "any of these must match".
 */
export const MultipleOrConditions: Story = {
  name: "Multiple OR conditions",
  args: {
    filters: {
      or: [
        {
          entity_type: "department",
          entity_field: "id",
          operator: "is",
          value: "engineering",
        },
        {
          entity_type: "department",
          entity_field: "id",
          operator: "is",
          value: "design",
        },
        {
          entity_type: "department",
          entity_field: "id",
          operator: "is",
          value: "product",
        },
      ],
    },
  },
}

/**
 * A nested filter: top-level AND containing a sub-group with OR logic.
 * Matches employees who are in engineering AND (are admin OR manager).
 */
export const NestedFilter: Story = {
  name: "Nested filter (AND with OR sub-group)",
  args: {
    filters: {
      and: [
        {
          entity_type: "department",
          entity_field: "id",
          operator: "is",
          value: "engineering",
        },
        {
          filters: {
            or: [
              {
                entity_type: "role",
                entity_field: "id",
                operator: "is",
                value: "admin",
              },
              {
                entity_type: "role",
                entity_field: "id",
                operator: "is",
                value: "manager",
              },
            ],
          },
        },
      ],
    },
  },
}

/**
 * Deeply nested filters: three levels of AND/OR grouping.
 */
export const DeeplyNested: Story = {
  name: "Deeply nested filter",
  args: {
    filters: {
      and: [
        {
          entity_type: "employee",
          entity_field: "id",
          operator: "is_not",
          value: "dave",
        },
        {
          filters: {
            or: [
              {
                entity_type: "department",
                entity_field: "id",
                operator: "is",
                value: "engineering",
              },
              {
                filters: {
                  and: [
                    {
                      entity_type: "department",
                      entity_field: "id",
                      operator: "is",
                      value: "product",
                    },
                    {
                      entity_type: "role",
                      entity_field: "id",
                      operator: "is",
                      value: "manager",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
}
