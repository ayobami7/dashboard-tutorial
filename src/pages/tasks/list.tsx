import React from 'react'
import { KanbanBoardContainer, KanbanBoard } from './kanban/board'
import KanbanColumn from './kanban/column'
import KanbanItem from './item'

const TasksList = () => {
  return (
    <>
        <KanbanBoardContainer>
            <KanbanBoard>
                <KanbanColumn>
                    <KanbanItem>

                    </KanbanItem>
                </KanbanColumn>
            </KanbanBoard>
        </KanbanBoardContainer>
    </>
  )
}

export default TasksList