import React from 'react'
import { KanbanBoardContainer, KanbanBoard } from './kanban/board'
import KanbanColumn from './kanban/column'
import KanbanItem from './item'
import { useList } from '@refinedev/core'
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import { TaskStage } from '@/graphql/schema.types'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { TasksQuery } from '@/graphql/types'
import ProjectCard from './kanban/card'

const TasksList = () => {
    const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
        resource: "taskStages",
        filters: [
          {
            field: "title",
            operator: "in",
            value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
          },
        ],
        sorters: [
          {
            field: "createdAt",
            order: "asc",
          },
        ],
        meta: {
          gqlQuery: TASK_STAGES_QUERY,
        },
      });

    const {data: tasks, isLoading: isLoadingTasks} = useList<GetFieldsFromList<TasksQuery>>({
        resource: 'tasks',
        sorters : [{
            field: 'dueDate',
            order: 'asc'
        }],
        pagination:{
            mode: 'off'
        },
        queryOptions: {
            enabled: !!stages
        },
        meta:{
            gqlQuery: TASKS_QUERY
        }
    })

    // group tasks by stage
    // it's convert Task[] to TaskStage[] (group by stage) for kanban
    // uses `stages` and `tasks` from useList hooks
    const taskStages = React.useMemo(() => {
        if (!tasks?.data || !stages?.data)
        return {
            unassignedStage: [],
            stages: [],
        };

        const unassignedStage = tasks.data.filter((task) => task.stageId === null);

        // prepare unassigned stage
        const grouped: TaskStage[] = stages.data.map((stage) => ({
        ...stage,
        tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
        }));

        return {
        unassignedStage,
        columns: grouped,
        };
    }, [tasks, stages]);

    const handleAddCard = (args: { stageId: string }) => {
        // const path =
        //   args.stageId === "unassigned"
        //     ? "/tasks/new"
        //     : `/tasks/new?stageId=${args.stageId}`;
    
        // replace(path);
      };

  return (
    <>
        <KanbanBoardContainer>
            <KanbanBoard>
                <KanbanColumn
                    id={"unassigned"}
                    title={"unassigned"}
                    count={taskStages?.unassignedStage?.length || 0}
                    onAddClick={() => handleAddCard({ stageId: "unassigned" })}
                >
                    {taskStages.unassignedStage?.map((task) => {
                        return (
                            <KanbanItem
                            key={task.id}
                            id={task.id}
                            data={{ ...task, stageId: "unassigned" }}
                            >
                            <ProjectCard
                                {...task}
                                dueDate={task.dueDate || undefined}
                            />
                            </KanbanItem>
                        );
                    })}
                    {/* {!taskStages.unassignedStage?.length && (
                        <KanbanAddCardButton
                            onClick={() => handleAddCard({ stageId: "unassigned" })}
                        />
                    )} */}
                </KanbanColumn>
            </KanbanBoard>
        </KanbanBoardContainer>
    </>
  )
}

export default TasksList