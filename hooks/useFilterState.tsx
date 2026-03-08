import { useEffect, useState } from "react"
import isEmpty from "lodash.isempty"
import isEqual from "lodash.isequal"
import { Entities, Entity, IFilter, IFilterCl } from "../types"
import { keyToPath, pathToKey } from "../services"
import { IData } from "../types"

interface IAddition {
  [key: string]: Array<IFilterCl | IFilter>
}

interface IEdit {
  [key: string]: Partial<IFilterCl>
}

interface IBoolOpEdit {
  [key: string]: string
}

type AdditionAction = "addCondition" | "addFilter"

interface IConditionToolKit {
  edit: (data: IData) => void
  undoEdit: () => void
  remove: () => void
  undoRemove: () => void
  toRemove: boolean
  isEdited: boolean
  displayCondition?: IFilterCl
}

interface IOperatorToolKit {
  edit: (value: string) => void
  undoEdit: () => void
  remove: () => void
  undoRemove: () => void
  toRemove: boolean
  isEdited: boolean
  displayOperator: string
}

interface IAdditionToolKit {
  createConditionAdder: (
    propertyPath: Array<string | number>,
  ) => (data?: IData | undefined) => void
  createFilterAdder: (
    propertyPath: Array<string | number>,
  ) => (data?: IData | undefined) => void
  createKeyUpdater: (
    propertyPath: Array<string | number>,
  ) => (data?: IData | undefined) => void
  createPropertyUpdater: (
    propertyPath: Array<string | number>,
  ) => (data?: IData | undefined) => void
  createDeleter: (
    propertyPath: Array<string | number>,
  ) => (data?: IData | undefined) => void
}

interface IFilterState {
  boolOpEdits: IBoolOpEdit
  boolOpRemovals: string[]
  edits: IEdit
  removals: string[]
  additions: IAddition
  isModified: () => boolean
  resetFilterState: () => void
  additionToolKitFactory: (pathKey: string) => IAdditionToolKit
  conditionToolKitFactory: (
    keyPath: string,
    condition: IFilterCl,
  ) => IConditionToolKit
  operatorToolKitFactory: (
    keyPath: string,
    operator: string,
  ) => IOperatorToolKit
}

const operatorOptions = [
  { id: "is", value: "is" },
  { id: "is_not", value: "is not" },
]

const useFilterState = (entities: Entities = {}): IFilterState => {
  // Five independent buckets of staged changes. Nothing in the original filter
  // is mutated until the consumer explicitly applies these on save.
  const [boolOpEdits, setBoolOpEdits] = useState<IBoolOpEdit>({})
  const [boolOpRemovals, setBoolOpRemovals] = useState<string[]>([])
  const [edits, setEdits] = useState<IEdit>({})
  const [removals, setRemovals] = useState<string[]>([])
  const [additions, setAdditions] = useState<IAddition>({})

  // Tracks the most recent addition type so the scroll effect below knows how
  // far to scroll to bring the new item into view.
  const [previousAdditionAction, setPreviousAdditionAction] =
    useState<AdditionAction | null>(null)

  // After a condition or filter group is added, scroll down to reveal it.
  // The offsets are approximate pixel heights of the added elements.
  useEffect(() => {
    let top
    switch (previousAdditionAction) {
      case "addCondition":
        top = 110
        break
      case "addFilter":
        top = 240
    }
    if (top) {
      window.scrollBy({ top, behavior: "smooth" })
      setPreviousAdditionAction(null)
    }
  }, [previousAdditionAction])

  const isModified = () => {
    // additions is a map of path key → array, so an empty array at a key still
    // counts as unmodified — only non-empty arrays indicate a real addition.
    let emptyAdditions = true
    for (const [, value] of Object.entries(additions)) {
      if (value.length > 0) {
        emptyAdditions = false
        break
      }
    }

    if (
      boolOpRemovals.length === 0 &&
      removals.length === 0 &&
      isEmpty(boolOpEdits) &&
      isEmpty(edits) &&
      emptyAdditions
    ) {
      return false
    }
    return true
  }

  const resetFilterState = () => {
    setEdits({})
    setAdditions({})
    setRemovals([])
    setBoolOpRemovals([])
    setBoolOpEdits({})
  }

  // Called once per rendered AND/OR group heading. Returns actions and derived
  // state scoped to that operator node. Handles both editing the operator value
  // (and ↔ or) and removing the entire group it belongs to.
  const operatorToolKitFactory = (
    keyPath: string,
    operator: string,
  ): IOperatorToolKit => {
    // The operator key path points to the AND/OR key itself (e.g. "filters.and").
    // Removing the group means deleting the parent object that contains it, so
    // we strip the last two segments ("filters" + operator) to get the container key.
    const deletePath = keyToPath(keyPath)
    deletePath.splice(deletePath.length - 2)
    const deleteKey = pathToKey(deletePath)

    const deleteIndex = boolOpRemovals.findIndex(
      (candidateKey) => candidateKey === deleteKey,
    )
    const toRemove = deleteIndex !== -1
    const isEdited = boolOpEdits[keyPath] !== undefined

    // Show the staged operator value if one exists, otherwise fall back to the original.
    const displayOperator = isEdited ? boolOpEdits[keyPath] : operator

    const edit = (value: string) => {
      const newBoolOpsEdits = { ...boolOpEdits }
      // If the user selects the original value, clear the edit record rather
      // than storing a no-op change.
      if (value === operator) {
        delete newBoolOpsEdits[keyPath]
      } else {
        newBoolOpsEdits[keyPath] = value
      }
      setBoolOpEdits(newBoolOpsEdits)
    }

    const undoEdit = () => {
      const newBoolOpsEdits = { ...boolOpEdits }
      delete newBoolOpsEdits[keyPath]
      setBoolOpEdits(newBoolOpsEdits)
    }

    const remove = () => {
      const newBoolOpRemovals = [...boolOpRemovals]
      newBoolOpRemovals.push(deleteKey)
      setBoolOpRemovals(newBoolOpRemovals)
    }

    const undoRemove = () => {
      const newBoolOpRemovals = [...boolOpRemovals]
      newBoolOpRemovals.splice(deleteIndex, 1)
      setBoolOpRemovals(newBoolOpRemovals)
    }

    return {
      edit,
      undoEdit,
      remove,
      undoRemove,
      toRemove,
      isEdited,
      displayOperator,
    }
  }

  // Called once per rendered existing condition. Returns actions and derived
  // state scoped to that condition node. Handles editing individual fields and
  // marking the condition for removal. Edit and removal are mutually exclusive
  // — the UI enforces this via the action button ternary and by disabling
  // inputs when toRemove is true.
  const conditionToolKitFactory = (
    keyPath: string,
    condition: IFilterCl,
  ): IConditionToolKit => {
    const deleteIndex = removals.findIndex(
      (deletePath) => deletePath === keyPath,
    )
    const toRemove = deleteIndex !== -1
    const isEdited = edits[keyPath] !== undefined

    // Merge staged edits onto the original condition for display purposes.
    // Undefined when unedited so consumers can use it as a presence check.
    const displayCondition = isEdited
      ? { ...condition, ...edits[keyPath] }
      : undefined

    const edit = (data: IData) => {
      const { property, value } = data
      const newEdits = { ...edits }
      const currentEdit = newEdits[keyPath]
      if (currentEdit) {
        const updatedEditRecord = {
          ...currentEdit,
          [property]: value,
        }

        // Changing entity_type resets value to the first available id for that
        // entity, since the previous value is unlikely to be valid for the new type.
        if (property === "entity_type") {
          updatedEditRecord.value = entities[value as Entity][0].id
        }

        // If the accumulated edits now match the original condition exactly,
        // remove the edit record entirely so isModified() stays accurate.
        if (isEqual({ ...condition, ...updatedEditRecord }, condition)) {
          delete newEdits[keyPath]
        } else {
          newEdits[keyPath] = updatedEditRecord
        }
      } else {
        const newEditRecord = {
          [property]: value,
        }
        if (property === "entity_type") {
          newEditRecord.value = entities[value as Entity][0].id
        }
        newEdits[keyPath] = newEditRecord
      }
      setEdits(newEdits)
    }

    const undoEdit = () => {
      const newEdits = { ...edits }
      delete newEdits[keyPath]
      setEdits(newEdits)
    }

    const remove = () => {
      const newRemovals = [...removals]
      newRemovals.push(keyPath)
      setRemovals(newRemovals)
    }

    const undoRemove = () => {
      const newRemovals = [...removals]
      newRemovals.splice(deleteIndex, 1)
      setRemovals(newRemovals)
    }

    return {
      edit,
      undoEdit,
      remove,
      undoRemove,
      toRemove,
      isEdited,
      displayCondition,
    }
  }

  // Called once per rendered condition list. Returns a set of functions for
  // managing new items (conditions and filter groups) staged under a given
  // parent path. Unlike the other two factories, this one is not scoped to a
  // single node — it covers all additions that belong to the parent array at
  // pathKey, and each returned function takes a propertyPath to target a
  // specific item within that additions array.
  const additionToolKitFactory = (pathKey: string): IAdditionToolKit => {
    // Higher-order helper that wires a mutation action into the additions state.
    // Returns a curried function: (propertyPath) => (data?) => void.
    //
    // propertyPath is relative to the additions entry for pathKey. An empty
    // array means act directly on the root of that entry (the top-level array).
    // A non-empty path traverses into nested additions, e.g. to reach a
    // condition inside an added sub-filter group.
    const actionOnAdditions =
      (
        action: (target: any, key: number | string, data?: IData) => void,
        type?: AdditionAction,
      ) =>
      (propertyPath: Array<string | number>) =>
      (data?: IData) => {
        const newAdditions = { ...additions }

        if (propertyPath.length === 0) {
          // Act on the root additions map directly, keyed by pathKey.
          action(newAdditions, pathKey, data)
        } else {
          // Traverse into the nested additions structure to find the target.
          let target: any = newAdditions[pathKey]
          let i = 0
          for (; i < propertyPath.length - 1; i++) {
            target = target[propertyPath[i]]
          }
          action(target, propertyPath[i], data)
        }

        setAdditions(newAdditions)
        if (type) {
          setPreviousAdditionAction(type)
        }
      }

    // The first entity key is used as the default when seeding new conditions
    // and filter groups, so the order of keys in the entities object matters.
    const defaultEntity = Object.keys(entities)[0] as Entity

    const createConditionAdder = () => {
      const newConditionData: IFilterCl = {
        entity_type: defaultEntity,
        entity_field: "id",
        operator: operatorOptions[0].id,
        value: entities[defaultEntity][0].id,
      }
      return actionOnAdditions((target, key) => {
        if (target[key]) {
          target[key].push(newConditionData)
        } else {
          target[key] = [newConditionData]
        }
      }, "addCondition")
    }

    const createFilterAdder = () => {
      // New groups are seeded with a single default condition so the group is
      // never rendered empty.
      const newFilterData: IFilter = {
        filters: {
          and: [
            {
              entity_type: defaultEntity,
              entity_field: "id",
              operator: operatorOptions[0].id,
              value: entities[defaultEntity][0].id,
            },
          ],
        },
      }
      return actionOnAdditions((target, key) => {
        if (target[key]) {
          target[key].push(newFilterData)
        } else {
          target[key] = [newFilterData]
        }
      }, "addFilter")
    }

    // Renames the AND/OR key on an added sub-filter group, e.g. { and: [...] }
    // → { or: [...] }. Reads the first (and only) entry to preserve the
    // conditions array, writes it under the new key, then deletes the old one.
    const createKeyUpdater = actionOnAdditions((target, key, data) => {
      if (
        key !== undefined &&
        typeof target[key] === "object" &&
        target[key] !== null &&
        data
      ) {
        const [operatorToReplace, conditionsToSave] = Object.entries(
          target[key],
        )[0]
        target[key][data.property] = conditionsToSave
        delete target[key][operatorToReplace]
      }
    })

    // Updates a single field on an added condition. Mirrors the entity_type
    // reset behaviour in conditionToolKitFactory.
    const createPropertyUpdater = actionOnAdditions((target, key, data) => {
      if (key !== undefined && data) {
        const { property, value } = data
        target[key][property] = value
        if (property === "entity_type") {
          target[key].value = entities[value as Entity][0].id
        }
      }
    })

    // Removes an item from an additions array by index.
    const createDeleter = actionOnAdditions((target, key) => {
      if (Array.isArray(target) && typeof key === "number") {
        target.splice(key, 1)
      }
    })

    return {
      createConditionAdder: createConditionAdder(),
      createFilterAdder: createFilterAdder(),
      createKeyUpdater,
      createPropertyUpdater,
      createDeleter,
    }
  }

  return {
    boolOpEdits,
    boolOpRemovals,
    edits,
    removals,
    additions,
    isModified,
    resetFilterState,
    additionToolKitFactory,
    conditionToolKitFactory,
    operatorToolKitFactory,
  }
}

export { useFilterState }
export type {
  IFilterState,
  IAddition,
  IEdit,
  IBoolOpEdit,
  AdditionAction,
  IAdditionToolKit,
  IConditionToolKit,
  IOperatorToolKit,
}
