import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Collapse,
    IconButton,
    Button,
    TableHead,
    Tab,
    Box,
    Container
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from '@mui/icons-material/Add';
import { HorizontalRule } from "@mui/icons-material";


export default function CustomTable() {
    const [tableData, setTableData] = useState(data);
    const [openRows, setOpenRows] = useState({});

    const toggleRow = (index) => {
        setOpenRows((prevOpenRows) => ({
            ...prevOpenRows,
            [index]: !prevOpenRows[index],
        }));
    };
    const toggleAllHandler = () => {
        let total = tableData.length;
        let toggleObj = openRows;
        for (let i = 0; i < total; i++) {
            setOpenRows((prevOpenRows) => ({
                ...prevOpenRows,
                [i]: !prevOpenRows[i],
            }));
        }
    }
    const openAllHandler = () => {
        let total = tableData.length;
        let toggleObj = openRows;
        for (let i = 0; i < total; i++) {
            setOpenRows((prevOpenRows) => ({
                ...prevOpenRows,
                [i]: true,
            }));
        }
    }
    const closeAllHandler = () => {
        let total = tableData.length;
        let toggleObj = openRows;
        for (let i = 0; i < total; i++) {
            setOpenRows((prevOpenRows) => ({
                ...prevOpenRows,
                [i]: false,
            }));
        }
    }
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }
        const sKey = source.droppableId;
        const dKey = destination.droppableId;
        const dIndex = destination.index;
        const sIndex = source.index;
        if (sKey === dKey) {
            if (sKey === "outer-drop") {

                const updatedData = moveItem(tableData, sIndex, dIndex);
                setTableData(updatedData);
            } else if (
                draggableId.startsWith("inner-title-drop") &&
                dKey.startsWith("inner-drop")
            ) {

                const tempData = tableData;
                let sContent = tempData[sIndex];
                let newSContent = {};
                let newParentContent = {};
                let dContent = tempData[sIndex].innerRow[dIndex];
                Object.assign(newSContent, {
                    id: sContent.id,
                    name: sContent.name,
                    calories: sContent.calories,
                    fat: sContent.fat,
                    carbs: sContent.carbs,
                    protein: sContent.protein,
                });
                tempData[sIndex].innerRow.splice(dIndex, 1, newSContent);
                Object.assign(newParentContent, {
                    id: dContent.id,
                    name: dContent.name,
                    calories: dContent.calories,
                    fat: dContent.fat,
                    carbs: dContent.carbs,
                    protein: dContent.protein,
                    innerRow: tempData[sIndex].innerRow,
                });
                Object.assign(tempData[sIndex], newParentContent);
                setTableData(tempData);
            } else if (sKey.startsWith("inner-drop")) {

                const outerIndex = parseInt(sKey.replace("inner-drop-", ""), 10);
                const updatedData = moveItemInner(
                    tableData,
                    outerIndex,
                    sIndex,
                    dIndex
                );
                setTableData(updatedData);
            }
        } else {
            if (sKey === "outer-drop" && dKey.startsWith("inner-drop")) {
                const outerIndex = parseInt(sKey.replace("outer-drop-", ""), 10);
                const innerIndex = parseInt(dKey.replace("inner-drop-", ""), 10);
                const updatedData = moveItemBetweenLists(
                    tableData,
                    outerIndex,
                    sIndex,
                    innerIndex,
                    dIndex
                );
                setTableData(updatedData);
            } else if (sKey.startsWith("inner-drop") && dKey === "outer-drop") {
                const outerIndex = parseInt(dKey.replace("outer-drop-", ""), 10);
                const innerIndex = parseInt(sKey.replace("inner-drop-", ""), 10);
                const updatedData = moveItemBetweenLists(
                    tableData,
                    outerIndex,
                    innerIndex,
                    sIndex,
                    dIndex
                );
                setTableData(updatedData);
            } else if (
                draggableId.startsWith("inner-title-drop") &&
                sKey.startsWith("inner-title-container-drop") &&
                dKey.startsWith("inner-drop") &&
                sIndex !== dIndex
            ) {
                const tempData = tableData;
                let sourceIdString = draggableId.match(/\d+/);
                let sourceTitleIndex = sourceIdString
                    ? parseInt(sourceIdString[0], 10) - 1
                    : null;
                let dParentIndexString = dKey.match(/\d+/);
                let dParentIndex = dParentIndexString
                    ? parseInt(dParentIndexString[0], 10)
                    : null;
                let destinationDropId = dIndex - 1;
                let dContent = tempData[dParentIndex].innerRow[destinationDropId];
                let innerContent = {};
                Object.assign(innerContent, {
                    id: tempData[sourceTitleIndex].id,
                    name: tempData[sourceTitleIndex].name,
                    calories: dContent.calories,
                    fat: tempData[sourceTitleIndex].fat,
                    carbs: tempData[sourceTitleIndex].carbs,
                    protein: tempData[sourceTitleIndex].protein,
                });
                tempData[dParentIndex].innerRow.splice(
                    destinationDropId,
                    1,
                    innerContent
                );
                let newParentContent = {};
                Object.assign(newParentContent, {
                    id: dContent.id,
                    name: dContent.name,
                    calories: dContent.calories,
                    fat: dContent.fat,
                    carbs: dContent.carbs,
                    protein: dContent.protein,
                    innerRow: tempData[sIndex].innerRow,
                });
                Object.assign(tempData[sourceTitleIndex], newParentContent);
                setTableData(tempData);
            }
            else if (
                draggableId.startsWith("inner-title-drop") &&
                sKey.startsWith("inner-title-container-drop") &&
                dKey.startsWith("inner-title-container-drop") &&
                sIndex !== dIndex
            ) {
                const tempData = tableData;
                const sParentData = tempData[sIndex];
                const dParentData = tempData[dIndex];
                let newSData = {}
                let newDData = {}
                Object.assign(newDData, {
                    id: sParentData.id,
                    name: sParentData.name,
                    calories: sParentData.calories,
                    fat: sParentData.fat,
                    carbs: sParentData.carbs,
                    protein: sParentData.protein,
                    innerRow: tempData[dIndex].innerRow,
                })
                Object.assign(newSData, {
                    id: dParentData.id,
                    name: dParentData.name,
                    calories: dParentData.calories,
                    fat: dParentData.fat,
                    carbs: dParentData.carbs,
                    protein: dParentData.protein,
                    innerRow: tempData[sIndex].innerRow,
                })
                Object.assign(tempData[sIndex], newSData)
                Object.assign(tempData[dIndex], newDData)
                setTableData(tempData)
            }
            else if (dKey.startsWith("inner-title-container-drop") && sKey.startsWith("inner-drop")) {
                const tempData = tableData;
                let sourceIdString = draggableId.match(/\d+/);
                let sourceTitleIndex = sourceIdString
                    ? parseInt(sourceIdString[0], 10)
                    : null;
                let dParentIndexString = dKey.match(/\d+/);
                let dParentIndex = dParentIndexString
                    ? parseInt(dParentIndexString[0], 10)
                    : null;
                let dContent = tempData[dParentIndex];
                let sContent = tempData[sourceTitleIndex].innerRow[sIndex];
                let innerContent = {};
                Object.assign(innerContent, {
                    id: dContent.id,
                    name: dContent.name,
                    calories: dContent.calories,
                    fat: dContent.fat,
                    carbs: dContent.carbs,
                    protein: dContent.protein,
                });
                tempData[sourceTitleIndex].innerRow.splice(
                    sIndex,
                    1,
                    innerContent
                );
                let newParentContent = {};
                Object.assign(newParentContent, {
                    id: sContent.id,
                    name: sContent.name,
                    calories: sContent.calories,
                    fat: sContent.fat,
                    carbs: sContent.carbs,
                    protein: sContent.protein,
                    innerRow: tempData[dIndex].innerRow,
                });
                Object.assign(tempData[dIndex], newParentContent);
                setTableData(tempData)
            }
            else if (
                sKey.startsWith("inner-drop") &&
                dKey.startsWith("inner-drop") &&
                sIndex !== dIndex
            ) {
                alert("AASLS");
                const tempData = tableData;
                let dParentIndexString = dKey.match(/\d+/);
                let sParentIndexString = sKey.match(/\d+/);
                let dParentIndex = dParentIndexString
                    ? parseInt(dParentIndexString[0], 10)
                    : null;
                let sParentIndex = sParentIndexString
                    ? parseInt(sParentIndexString[0], 10)
                    : null;
                let oldDInnerRow = tempData[dParentIndex].innerRow;
                let oldSInnerRow = tempData[sParentIndex].innerRow;
                let movedItem = tempData[sParentIndex].innerRow[sIndex];
                oldDInnerRow.splice(dIndex, 0, movedItem);
                oldSInnerRow.splice(sIndex, 1);
                delete tempData[dParentIndex].innerRow;
                delete tempData[sParentIndex].innerRow;
                tempData[dParentIndex].innerRow = oldDInnerRow;
                tempData[sParentIndex].innerRow = oldSInnerRow;
                setTableData(tempData);
            }
        }
    };
    const moveItemBetweenLists = (
        array,
        outerIndex,
        sourceIndex,
        destinationIndex
    ) => {
        const newArray = [...array];
        const [movedItem] = newArray[outerIndex].innerRow.splice(sourceIndex, 1);
        newArray[outerIndex].innerRow.splice(destinationIndex, 0, movedItem);
        return newArray;
    };
    const moveItem = (array, sourceIndex, destinationIndex) => {
        const newArray = [...array];
        const movedItem = newArray[sourceIndex];
        newArray.splice(sourceIndex, 1);
        newArray.splice(destinationIndex, 0, movedItem);
        return newArray;
    };
    const moveItemInner = (array, outerIndex, sourceIndex, destinationIndex) => {
        const newArray = [...array];
        const movedItem = newArray[outerIndex].innerRow[sourceIndex];
        newArray[outerIndex].innerRow.splice(sourceIndex, 1);
        newArray[outerIndex].innerRow.splice(destinationIndex, 0, movedItem);
        return newArray;
    };

    return (
        <React.Fragment>
            <div className="button-wrapper">
                <Button variant="contained" onClick={() => {
                    toggleAllHandler();
                }}>Toggle All</Button>
                <Button variant="contained" onClick={() => {
                    openAllHandler();
                }}>Open All</Button>
                <Button variant="contained" onClick={() => {
                    closeAllHandler();
                }}>Close All</Button>
            </div>
            <div className="table" aria-label="simple table"  >
                <div className="table-head">
                    <div className="table-row">
                        <div className="table-cell" />
                        <div className="table-cell">Dessert (100g serving)</div>
                        <div className="table-cell" align="right">Calories</div>
                        <div className="table-cell" align="right">Fat&nbsp;(g)</div>
                        <div className="table-cell" align="right">Carbs&nbsp;(g)</div>
                        <div className="table-cell" align="right">Protein&nbsp;(g)</div>
                    </div>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="outer-drop" type="outer-drop">
                        {(provided, snapshot) => (
                            <div className="draggable-table table-body" ref={provided.innerRef} {...provided.droppableProps}>
                                {tableData?.map((row, outerIndex) => (
                                    <div className="table-row" key={row.id}>
                                        <Draggable
                                            key={row.id + "outer" + outerIndex}
                                            draggableId={`outer-drop-${row.id}`}
                                            index={outerIndex}
                                            className="outer-drop-wrapper"
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Droppable
                                                        droppableId={`inner-drop-${outerIndex}`}
                                                        type="inner-drop"
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                            >
                                                                <Draggable
                                                                    key={
                                                                        row.id + "title-container" + outerIndex
                                                                    }
                                                                    draggableId={`inner-title-container-drag-${row.id}`}
                                                                    index={outerIndex}

                                                                >
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className={`${openRows[outerIndex] === true && 'title-drag-container'}`}
                                                                        >

                                                                            <Droppable
                                                                                droppableId={`inner-title-container-drop${outerIndex}`}
                                                                                type="inner-drop"
                                                                            >
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.droppableProps}
                                                                                        className="inner-title-section"
                                                                                    >
                                                                                        <Draggable
                                                                                            key={
                                                                                                row.id +
                                                                                                "title" +
                                                                                                outerIndex
                                                                                            }
                                                                                            draggableId={`inner-title-drop-${row.id}`}
                                                                                            index={outerIndex}

                                                                                        >
                                                                                            {(provided, snapshot) => (
                                                                                                <div
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                >

                                                                                                    <div
                                                                                                        // component="td"   
                                                                                                        // scope="row"
                                                                                                        className={`${openRows[outerIndex] === true && 'heading-table-lines'} table-cell`}
                                                                                                    >
                                                                                                        <IconButton sx={{ padding: 0 }} onClick={() => toggleRow(outerIndex)}>
                                                                                                            {openRows[outerIndex] !== true ? <AddIcon color="#0000008a" /> : <HorizontalRule color="#0000008a" />}
                                                                                                        </IconButton>
                                                                                                    </div>
                                                                                                    <div className="table-cell"
                                                                                                        component="td"
                                                                                                    // scope="row"
                                                                                                    >
                                                                                                        {row.name}
                                                                                                    </div>
                                                                                                    <div className="table-cell" align="right">
                                                                                                        {row.calories}
                                                                                                    </div>
                                                                                                    <div className="table-cell" align="right">
                                                                                                        {row.fat}
                                                                                                    </div>
                                                                                                    <div className="table-cell" align="right">
                                                                                                        {row.carbs}
                                                                                                    </div>
                                                                                                    <div className="table-cell" align="right">
                                                                                                        {row.protein}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                        {provided.placeholder}
                                                                                    </div>
                                                                                )}
                                                                            </Droppable>
                                                                        </div>
                                                                    )}
                                                                </Draggable>


                                                                {row.innerRow.map(
                                                                    (innerRow, innerIndex) => (
                                                                        <Draggable
                                                                            key={
                                                                                innerRow.id +
                                                                                "inner-item" +
                                                                                innerIndex
                                                                            }
                                                                            draggableId={`inner-drop-${outerIndex}-${innerRow.id}`}
                                                                            index={innerIndex}
                                                                        >
                                                                            {(provided, snapshot) => (
                                                                                <Collapse in={openRows[outerIndex]} className="inner-row-mar">
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                    >
                                                                                        <div
                                                                                            component="th"
                                                                                            scope="row"
                                                                                            className={`inner-table-lines table-cell`}
                                                                                        >
                                                                                            <HorizontalRule color="#0000008a" />
                                                                                        </div>
                                                                                        <div className="table-cell"
                                                                                            component="th"
                                                                                            scope="row"
                                                                                        >
                                                                                            {innerRow.name}
                                                                                        </div>
                                                                                        <div className="table-cell" align="right">
                                                                                            {innerRow.calories}
                                                                                        </div>
                                                                                        <div className="table-cell" align="right">
                                                                                            {innerRow.fat}
                                                                                        </div>
                                                                                        <div className="table-cell" align="right">
                                                                                            {innerRow.carbs}
                                                                                        </div>
                                                                                        <div className="table-cell" align="right">
                                                                                            {innerRow.protein}
                                                                                        </div>
                                                                                    </div>
                                                                                </Collapse>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                )}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            )}
                                        </Draggable>
                                    </div>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>
        </React.Fragment>
    );
}

const data = [
    {
        id: 1,
        name: "Frozen yoghurt Title",
        calories: 159,
        fat: 6,
        carbs: 24,
        protein: 4,
        innerRow: [
            {
                id: 6,
                name: "Ice cream sandwich",
                calories: 237,
                fat: 9,
                carbs: 37,
                protein: 4.3,
            },
            {
                id: 7,
                name: "Eclair",
                calories: 262,
                fat: 16,
                carbs: 24,
                protein: 6,
            },
            {
                id: 8,
                name: "Cupcake",
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
            },
            {
                id: 9,
                name: "Gingerbread",
                calories: 356,
                fat: 16,
                carbs: 49,
                protein: 3.9,
            },
        ],
    },
    {
        id: 2,
        name: "Ice cream sandwich Title",
        calories: 237,
        fat: 9,
        carbs: 37,
        protein: 4.3,
        innerRow: [
            {
                id: 10,
                name: "Frozen yoghurt",
                calories: 159,
                fat: 6,
                carbs: 24,
                protein: 4,
            },

            {
                id: 11,
                name: "Eclair",
                calories: 262,
                fat: 16,
                carbs: 24,
                protein: 6,
            },
            {
                id: 12,
                name: "Cupcake",
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
            },
            {
                id: 13,
                name: "Gingerbread",
                calories: 356,
                fat: 16,
                carbs: 49,
                protein: 3.9,
            },
        ],
    },
    {
        id: 3,
        name: "Eclair Title",
        calories: 262,
        fat: 16,
        carbs: 24,
        protein: 6,
        innerRow: [
            {
                id: 14,
                name: "Frozen yoghurt",
                calories: 159,
                fat: 6,
                carbs: 24,
                protein: 4,
            },
            {
                id: 15,
                name: "Ice cream sandwich",
                calories: 237,
                fat: 9,
                carbs: 37,
                protein: 4.3,
            },

            {
                id: 16,
                name: "Cupcake",
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
            },
            {
                id: 17,
                name: "Gingerbread",
                calories: 356,
                fat: 16,
                carbs: 49,
                protein: 3.9,
            },
        ],
    },
    {
        id: 4,
        name: "Cupcake Title",
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        innerRow: [
            {
                id: 18,
                name: "Frozen yoghurt",
                calories: 159,
                fat: 6,
                carbs: 24,
                protein: 4,
            },
            {
                id: 19,
                name: "Ice cream sandwich",
                calories: 237,
                fat: 9,
                carbs: 37,
                protein: 4.3,
            },
            {
                id: 20,
                name: "Eclair",
                calories: 262,
                fat: 16,
                carbs: 24,
                protein: 6,
            },

            {
                id: 21,
                name: "Gingerbread",
                calories: 356,
                fat: 16,
                carbs: 49,
                protein: 3.9,
            },
        ],
    },
    {
        id: 5,
        name: "Gingerbread Title",
        calories: 356,
        fat: 16,
        carbs: 49,
        protein: 3.9,
        innerRow: [
            {
                id: 23,
                name: "Frozen yoghurt",
                calories: 159,
                fat: 6,
                carbs: 24,
                protein: 4,
            },
            {
                id: 24,
                name: "Ice cream sandwich",
                calories: 237,
                fat: 9,
                carbs: 37,
                protein: 4.3,
            },
            {
                id: 25,
                name: "Eclair",
                calories: 262,
                fat: 16,
                carbs: 24,
                protein: 6,
            },
            {
                id: 26,
                name: "Cupcake",
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
            },
        ],
    },
];