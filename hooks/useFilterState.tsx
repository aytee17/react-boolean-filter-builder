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
  createAdditionToolKit: (pathKey: string) => IAdditionToolKit
  createConditionToolKit: (
    keyPath: string,
    condition: IFilterCl,
  ) => IConditionToolKit
  createOperatorToolKit: (keyPath: string, operator: string) => IOperatorToolKit
}

const operatorOptions = [
  { id: "is", value: "is" },
  { id: "is_not", value: "is not" },
]

const useFilterState = (entities: Entities = {}): IFilterState => {
  const [boolOpEdits, setBoolOpEdits] = useState<IBoolOpEdit>({})
  const [boolOpRemovals, setBoolOpRemovals] = useState<string[]>([])
  const [edits, setEdits] = useState<IEdit>({})
  const [removals, setRemovals] = useState<string[]>([])
  const [additions, setAdditions] = useState<IAddition>({})
  const [previousAdditionAction, setPreviousAdditionAction] =
    useState<AdditionAction | null>(null)

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
    let emptyAdditions = true
    for (const [, value] of Object.entries(additions)) {
      if (value.length > 0) {
        emptyAdditions = false
        break
      } else {
        continue
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

  const createOperatorToolKit = (
    keyPath: string,
    operator: string,
  ): IOperatorToolKit => {
    const deletePath = keyToPath(keyPath)
    deletePath.splice(deletePath.length - 2)
    const deleteKey = pathToKey(deletePath)

    const deleteIndex = boolOpRemovals.findIndex(
      (candidateKey) => candidateKey === deleteKey,
    )
    const toRemove = deleteIndex !== -1
    const isEdited = boolOpEdits[keyPath] !== undefined

    const displayOperator = isEdited ? boolOpEdits[keyPath] : operator

    const edit = (value: string) => {
      const newBoolOpsEdits = { ...boolOpEdits }
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

  const createConditionToolKit = (
    keyPath: string,
    condition: IFilterCl,
  ): IConditionToolKit => {
    const deleteIndex = removals.findIndex(
      (deletePath) => deletePath === keyPath,
    )
    const toRemove = deleteIndex !== -1
    const isEdited = edits[keyPath] !== undefined

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

        if (property === "entity_type") {
          updatedEditRecord.value = entities[value as Entity][0].id
        }

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

  const createAdditionToolKit = (pathKey: string): IAdditionToolKit => {
    const actionOnAdditions =
      (
        action: (target: any, key: number | string, data?: IData) => void,
        type?: AdditionAction,
      ) =>
      (propertyPath: Array<string | number>) =>
      (data?: IData) => {
        const newAdditions = { ...additions }

        if (propertyPath.length === 0) {
          action(newAdditions, pathKey, data)
        } else {
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

    const createPropertyUpdater = actionOnAdditions((target, key, data) => {
      if (key !== undefined && data) {
        const { property, value } = data
        target[key][property] = value
        if (property === "entity_type") {
          target[key].value = entities[value as Entity][0].id
        }
      }
    })

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
    createAdditionToolKit,
    createConditionToolKit,
    createOperatorToolKit,
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
